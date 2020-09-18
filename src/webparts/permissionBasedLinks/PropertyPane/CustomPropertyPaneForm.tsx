import * as React from "react";
import styles from "./CustomPropertyPane.module.scss";
import {
  Panel,
  PanelType,
  Label,
  TextField,
  DefaultButton,
  Dropdown,
  IconButton,
  TooltipHost,
  FontIcon,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  SpinnerLabelPosition,
} from "@fluentui/react";
import { IconPicker } from "@pnp/spfx-controls-react/lib/IconPicker";
import { IItemObject } from "../Common/IItemObject";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DirectoryService } from "../Services/DirectoryService";

export interface ICustomPropertyPaneFormProps {
  isNew: boolean;
  formData: IItemObject;
  panelOpen: boolean;
  formSave(item: IItemObject): void;
  closePanel(): void;
  context: any;
}
interface ICustomPropertyPaneFormState {
  icon: string;
  title: string;
  url: string;
  selectedKey: string;
  errorMessage: string;
  targetAudience: any[];
  targetAudienceStringColl: string[];
  description: string;
  peoplePickerDisabled: boolean;
}
const TargetOptions = [
  { key: "_blank", text: "Blank" },
  { key: "_self", text: "Self" },
];

export class CustomPropertyPaneForm extends React.Component<
  ICustomPropertyPaneFormProps,
  ICustomPropertyPaneFormState
> {
  constructor(props) {
    super(props);
    this.state = {
      icon: "",
      title: "",
      url: "",
      selectedKey: "_blank",
      errorMessage: "",
      targetAudience: undefined,
      targetAudienceStringColl: [],
      description: "",
      peoplePickerDisabled: false,
    };
  }

  public componentDidMount() {
    if (!this.props.isNew) {
      let dataState = {
        icon: this.props.formData.iconname,
        title: this.props.formData.title,
        url: this.props.formData.url,
        selectedKey: this.props.formData.target,
        description: this.props.formData.description,
        targetAudience: this.props.formData.targetgroup,
      };
      let idColl = [];
      var userColl = undefined;
      if (this.props.formData.targetgroup) {
        userColl = this.props.formData.targetgroup.map((x) => {
          let splitColl = x["loginName"].split("|");
          let text = splitColl[2];
          if (text.indexOf("@") < 1) {
            if (x["secondaryText"] == "FederatedDirectoryClaimProvider") {
              idColl.push(text);
              text = "";
            } else {
              text = x["text"];
            }
          }
          return text;
        });
      }
      if (idColl.length > 0) {
        let dServices = new DirectoryService(this.props.context);
        userColl = userColl.filter((x) => x != "");
        dataState["peoplePickerDisabled"] = true;
        dServices
          .getNameOrEmail(idColl)
          .then((result: string[]) => {
            if (result.length > 0) {
              userColl.push(...result);
            }
            this.setState({ 
              targetAudienceStringColl:userColl,
              peoplePickerDisabled:false,
             });
            
          })
          .catch((err) => {
            this.setState({ 
              targetAudienceStringColl:userColl,
              peoplePickerDisabled:false,
              
             });
          });
      } else {
        dataState["targetAudienceStringColl"] = userColl;
      }

      this.setState({ ...dataState });
    }
  }

  private onSave = () => {
    this.setState({ errorMessage: "" });
    if (
      !this.state.title ||
      this.state.title == "" ||
      !this.state.url ||
      this.state.url == ""
    ) {
      this.setState({ errorMessage: "Title and Url field cannot be empty." });
      return;
    }
    var obj: IItemObject = {
      key: this.props.isNew ? 0 : this.props.formData.key,
      title: this.state.title,
      url: this.state.url,
      iconname: this.state.icon,
      target: this.state.selectedKey,
      targetgroup: this.state.targetAudience,
      description: this.state.description,
    };
    this.props.formSave(obj);
  }

  private onChange = (evt, item) => {
    this.setState({ selectedKey: item.key });
  }
  private _getPeoplePickerItems(pitems: any[]) {
    console.log("Items:", pitems);
    this.setState({
      targetAudience: pitems,
    });
  }
  public render(): JSX.Element {
    return (
      <Panel
        isOpen={this.props.panelOpen}
        onDismiss={() => {
          this.props.closePanel();
        }}
        type={PanelType.smallFixedFar}
        headerText={this.props.isNew ? "Add Links" : "Edit Links"}
        onOuterClick={() => {}}
        isLightDismiss
        className={styles.propertyPaneLinks}
      >
        <TextField
          label="Title"
          value={this.state.title}
          required
          onChange={(evt, newValue) => {
            this.setState({
              title: newValue,
            });
          }}
        />
        <TextField
          label="Description"
          value={this.state.description}
          multiline
          rows={3}
          onChange={(evt, newValue) => {
            this.setState({
              description: newValue,
            });
          }}
        />
        <TextField
          label="Url"
          value={this.state.url}
          required
          onChange={(evt, newValue) => {
            this.setState({
              url: newValue,
            });
          }}
        />
        <PeoplePicker
          context={this.props.context}
          titleText="Target Group"
          showtooltip={true}
          isRequired={false}
          selectedItems={this._getPeoplePickerItems.bind(this)}
          principalTypes={[
            PrincipalType.User,
            PrincipalType.SecurityGroup,
            PrincipalType.DistributionList,
          ]}
          showHiddenInUI={false}
          personSelectionLimit={5}
          defaultSelectedUsers={this.state.targetAudienceStringColl}
          disabled={this.state.peoplePickerDisabled}
          //ensureUser={true}
        />
        {this.state.peoplePickerDisabled && (
          <Spinner
            size={SpinnerSize.xSmall}
            label="loading.."
            labelPosition={"right"}
          />
        )}
        <Dropdown
          label="Target"
          options={TargetOptions}
          selectedKey={this.state.selectedKey}
          onChange={this.onChange}
        />

        <Stack horizontal tokens={{ childrenGap: 15 }}>
          <Stack.Item>
            <IconPicker
              buttonLabel={"Icon"}
              renderOption={"panel"}
              //   onChange={(iconName: string) => {
              //     this.setState({ icon: iconName });
              //   }}
              onSave={(iconName: string) => {
                this.setState({ icon: iconName });
              }}
              currentIcon={this.state.icon}
              buttonClassName={styles.iconPickerBtnClass}
              panelClassName={styles.iconPickerPanelClass}
            />
          </Stack.Item>
          <Stack.Item>
            <TooltipHost
              content={this.state.icon}
              id="tooltip"
              calloutProps={{ gapSpace: 20 }}
            >
              <FontIcon
                iconName={this.state.icon}
                className={styles.iconClass}
              />
            </TooltipHost>{" "}
          </Stack.Item>
        </Stack>

        <DefaultButton
          className={styles.formSaveBtn}
          text={this.props.isNew ? "Add" : "Update"}
          onClick={this.onSave.bind(this)}
        />
        {this.state.errorMessage == "" ? (
          ""
        ) : (
          <MessageBar messageBarType={MessageBarType.error}>
            {this.state.errorMessage}
          </MessageBar>
        )}
      </Panel>
    );
  }
}
