import * as React from "react";
import styles from "./PermissionBasedLinks.module.scss";
import { IPermissionBasedLinksProps } from "./IPermissionBasedLinksProps";
import { IItemObject } from "../Common/IItemObject";
import {
  MessageBar,
  MessageBarType,
  FontIcon,
  List,
  ProgressIndicator,
  getTheme,
  FocusZone,
  IPageSpecification,
  IRectangle, Fabric
} from "@fluentui/react";
import { UserServices } from "../Services/UserData";
import { ButtonLinks } from "./ButtonLinks";
export interface IPermissionBasedLinksState {
  links: IItemObject[];
  isApiRequestComplete: boolean;
  errorMessage: string;
  itemCount:number;
  width:number;
}
export default class PermissionBasedLinks extends React.Component<
  IPermissionBasedLinksProps,
  IPermissionBasedLinksState
> {
  private containerDiv;
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      isApiRequestComplete: false,
      errorMessage: "",
      itemCount:0,
      width:-1
    };
    this.containerDiv = React.createRef();
  }
  public componentDidMount() {
    let usrService = new UserServices(this.props.context);
    usrService
      .getLinks(this.props.links)
      .then((res: IItemObject[]) => {
        this.setState({
          links: res,
          isApiRequestComplete: true,
          errorMessage: "",
        });
      })
      .catch((err) => {
        this.setState({
          links: [],
          isApiRequestComplete: true,
          errorMessage: err,
        });
      });
      this.calculateWidthAndItemCount(this.containerDiv.current.clientWidth);
  }
  public onRenderCell(item: IItemObject, index: number | undefined) {
    return <ButtonLinks link={item} showDescription={true} width={this.state.width} />;
  }
  private calculateWidthAndItemCount = (screenWidth) => {
    const ITEM_WIDTH_MARGIN = 20;
    const ITEM_HEIGHT_MARGIN = 10;
    const ITEM_MIN_WIDTH = 212;
    const ITEM_MAX_WIDTH = 286;
    const MAX_ITEM_COUNT_PER_ROW = 4;
    const MOBILE_VIEW_WIDTH_THRESHOLD = 2 * ITEM_MIN_WIDTH + ITEM_WIDTH_MARGIN;
    const DEFAULT_ITEMS_PER_PAGE = 12;
    var itemCount =
      screenWidth < MOBILE_VIEW_WIDTH_THRESHOLD
        ? 1
        : Math.min(
            Math.floor(
              (screenWidth + ITEM_WIDTH_MARGIN) /
                (ITEM_MIN_WIDTH + ITEM_WIDTH_MARGIN)
            ) || 1,
            MAX_ITEM_COUNT_PER_ROW
          );
    let width =
      1 === itemCount
        ? screenWidth
        : Math.min(
            (screenWidth + ITEM_WIDTH_MARGIN) / itemCount - ITEM_WIDTH_MARGIN,
            ITEM_MAX_WIDTH
          );

          this.setState({
            itemCount:itemCount,
            width:width
          });

  }
  public getItemCount(
    itemIndex?: number,
    visibleRect?: IRectangle
  ): number {
   
    return 2*this.state.itemCount;
  }


  public render(): React.ReactElement<IPermissionBasedLinksProps> {
    return (
      <Fabric>
      <div className={styles.permissionBasedLinks}>
        <div className={styles.container} ref={this.containerDiv}>
          {!this.state.isApiRequestComplete && (
            <ProgressIndicator label="Loading..." description="Getting links" />
          )}
          {this.state.isApiRequestComplete && this.state.errorMessage != "" && (
            <MessageBar messageBarType={MessageBarType.info}>
              {this.state.errorMessage}
            </MessageBar>
          )}
          {this.state.isApiRequestComplete && this.state.errorMessage == "" && (
            <FocusZone>
              <List
                items={this.state.links}
                onRenderCell={this.onRenderCell.bind(this)}
                getItemCountForPage={this.getItemCount.bind(this)}
              />
            </FocusZone>
          )}
        </div>
      </div>
      </Fabric>
    );
  }
}

//getPageSpecification
