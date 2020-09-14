import * as React from "react";
import styles from "./CustomPropertyPane.module.scss";
import { DefaultButton } from "@fluentui/react/lib/Button";
import {
  Panel,
  PanelType,
  Label,
  TextField,
  PrimaryButton,
  CommandBar,
  ICommandBarItemProps,
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from "@fluentui/react";
import {
  ICustomPropertyPaneControlProps,
  ICustomPropertyPaneControlState,
} from "./ICustomPropertyPaneControl";
import { IItemObject } from "../Common/IItemObject";

import {
  ICustomPropertyPaneItemViewerProps,
  CustomPropertyPaneItemViewer,
} from "./CustomPropertyPaneItemViewer";
import {
  ICustomPropertyPaneFormProps,
  CustomPropertyPaneForm,
} from "./CustomPropertyPaneForm";
import { initializeIcons } from "@uifabric/icons";
initializeIcons();

export class CustomPropertyPaneControl extends React.Component<
  ICustomPropertyPaneControlProps,
  ICustomPropertyPaneControlState
> {
  private itemviewer;
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
      nestedPanelOpen: false,
      linklist: this.props.value,
      key: -1,
      isNew: true,
      editItemData: null,
    };
    this.itemviewer = React.createRef();
  }

  /**
   * Open the panel
   */
  private openPanel = () => {
    this.setState({
      panelOpen: true,
    });
  }

  /**
   * Closes the panel
   */
  private closePanel = () => {
    this.setState({
      panelOpen: false,
    });
  }

  /**
   * On save action
   */
  private onSave = () => {
    //console.log("test onkar");
 
    this.props.onChanged(this.state.linklist);
    this.setState({
      panelOpen: false,
    });
  }

  public onItemViewUpdated(itemColl: IItemObject[]) {
    this.setState({
      linklist: itemColl,
    });
  }
  public onItemEdit(item: IItemObject) {
    console.log("item.edit");
    this.setState({
      nestedPanelOpen: true,
      isNew: false,
      editItemData: item,
    });
  }
  public onFormSave(item: IItemObject) {
    let itemColl = this.state.linklist;
    if (!itemColl) {
      itemColl = [];
    }

    if (item.key == 0) {
      let keyId = this.getKeyValue();
      let itemObj: IItemObject = {
        key: keyId,
        title: item.title,
        target: item.target,
        url: item.url,
        iconname: item.iconname,
        targetgroup:item.targetgroup,
        description:item.description
      };
      itemColl = [...itemColl, itemObj];
      this.setState({
        key: keyId + 1,
      });
    } else {
      let filtereditems = itemColl.filter((x) => x.key == item.key);
      filtereditems[0].iconname = item.iconname;
      filtereditems[0].title = item.title;
      filtereditems[0].target = item.target;
      filtereditems[0].url = item.url;
      filtereditems[0].targetgroup = item.targetgroup;
      filtereditems[0].description = item.description;
    }
    this.setState(
      {
        nestedPanelOpen: false,
        linklist: itemColl,
      },
      () => {
        this.itemviewer.current.updateItemsState(this.state.linklist);
      }
    );
  }
  public closeNestedPanel() {
    this.setState({
      nestedPanelOpen: false,
    });
  }

  private getKeyValue(): number {
    if (this.state.key < 1) {
      if (!this.state.linklist || this.state.linklist.length < 1) {
        return 1;
      } else {
        const keyColl = this.state.linklist.map((x) => {
          return x.key;
        });
        return Math.max(...keyColl) + 1;
      }
    } else return this.state.key;
  }

  public render(): JSX.Element {
    // console.log(this.state.linklist);
    // if (this.itemviewer.current) {
    // }
    return (
      <div className={styles.propertyPaneLinks}>
        <Label>{this.props.label}</Label>

        <DefaultButton
          text={this.props.manageBtnLabel}
          onClick={this.openPanel}
        />

        <Panel
          isOpen={this.state.panelOpen}
          onDismiss={this.closePanel}
          type={PanelType.extraLarge}
          headerText={this.props.panelHeader}
          onOuterClick={() => {}}
          className={styles.propertyPaneLinks}
        >
          <Stack>
            <Stack.Item>
              <CommandBar
                items={[
                  {
                    key: "newItem",
                    text: "New",
                    iconProps: { iconName: "Add" },
                    ariaLabel: "New",
                    onClick: () => {
                      this.setState({
                        nestedPanelOpen: true,
                        isNew: true,
                        editItemData: null,
                      });
                    },
                  },
                ]}
              />
            </Stack.Item>
            <Stack.Item>
              <CustomPropertyPaneItemViewer
                formData={this.state.linklist}
                ref={this.itemviewer}
                updateDataCollection={this.onItemViewUpdated.bind(this)}
                onEdit={this.onItemEdit.bind(this)}
              />
            </Stack.Item>
          </Stack>
          {!this.state.nestedPanelOpen ? (
            ""
          ) : (
            <CustomPropertyPaneForm
              isNew={this.state.isNew}
              formData={this.state.editItemData}
              formSave={this.onFormSave.bind(this)}
              panelOpen={this.state.nestedPanelOpen}
              closePanel={this.closeNestedPanel.bind(this)}
              context={this.props.wpContext}
            />
          )}
          <PrimaryButton text="Save" onClick={this.onSave.bind(this)} className={styles.savePaneControl} />
        </Panel>
      </div>
    );
  }
}
