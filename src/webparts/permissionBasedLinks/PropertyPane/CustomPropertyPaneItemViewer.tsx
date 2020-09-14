import * as React from "react";
import styles from "./CustomPropertyPane.module.scss";
import {
  DetailsList,
  SelectionMode,
  DetailsListLayoutMode,
  ConstrainMode,
  IColumn,
  Dropdown,
  IDragDropEvents,
  IDragDropContext,
  Selection,
  FontIcon,
  CheckboxVisibility,
  ContextualMenu,
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuProps,
} from "@fluentui/react";
import { IItemObject } from "../Common/IItemObject";
import { getTheme, mergeStyles } from "@fluentui/react/lib/Styling";
export interface ICustomPropertyPaneItemViewerProps {
  formData: IItemObject[];
  updateDataCollection(itemColl: IItemObject[]): void;
  onEdit(item: IItemObject): void;
}
interface ICustomPropertyPaneItemViewerState {
  items: IItemObject[];
  contextualMenuProps?: IContextualMenuProps;
}

const theme = getTheme();
const dragEnterClass = mergeStyles({
  backgroundColor: theme.palette.neutralLight,
});

const columns: IColumn[] = [
  {
    key: "column1",
    name: "Icon",
    fieldName: "iconname",
    minWidth: 24,
    maxWidth: 24,
    onRender: (item: IItemObject) => {
      return (
        <FontIcon
          iconName={item.iconname}
          className={styles.iconClassListView}
        />
      );
    },
  },
  {
    key: "column2",
    name: "Title",
    fieldName: "title",
    minWidth: 200,
    maxWidth: 300,
    isRowHeader: true,
    isResizable: true,

    data: "string",
    isPadded: true,
  },
  {
    key: "column21",
    name: "Description",
    fieldName: "description",
    minWidth: 200,
    maxWidth: 250,
    data: "string",
    isPadded: true,
    isMultiline: true,
  },
  {
    key: "column3",
    name: "Url",
    fieldName: "url",
    minWidth: 250,
    maxWidth: 300,
    data: "string",
    isPadded: true,
    isMultiline: true,
  },
  {
    key: "column31",
    name: "Target Group",
    fieldName: "targetgroup",
    minWidth: 150,
    maxWidth: 200,
    data: "string",
    isPadded: true,
    onRender: (item: IItemObject) => {
      let itemValue = "";
      if (item.targetgroup) {
        var itemValueArray = item.targetgroup.map((x) => {
          return x["text"];
        });
        itemValue = itemValueArray.join(";");
      }
      return <span>{itemValue}</span>;
    },
  },
  {
    key: "column4",
    name: "Target",
    fieldName: "target",
    minWidth: 100,
    maxWidth: 130,
    data: "string",
    isPadded: true,
    onRender: (item: IItemObject) => {
      let itemValue = item.target == "_self" ? "Self" : "Blank";
      return <span>{itemValue}</span>;
    },
  },
];

export class CustomPropertyPaneItemViewer extends React.Component<
  ICustomPropertyPaneItemViewerProps,
  ICustomPropertyPaneItemViewerState
> {
  private _selection: Selection;
  private _dragDropEvents: IDragDropEvents;
  private _draggedItem: any;
  private _draggedIndex: number;

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      contextualMenuProps: undefined,
    };

    this._selection = new Selection();
    this._dragDropEvents = this._getDragDropEvents();
    this._draggedIndex = -1;
  }

  public componentDidMount() {
    if (this.props.formData && this.props.formData.length > 0) {
      this.setState({
        items: this.props.formData,
      });
    }
  }
  public updateItemsState(itemsColl: IItemObject[]) {
    if (itemsColl && itemsColl.length > 0) {
      this.setState({
        items: [...itemsColl],
      });
    }
  }

  private _getDragDropEvents(): IDragDropEvents {
    return {
      canDrop: (
        dropContext?: IDragDropContext,
        dragContext?: IDragDropContext
      ) => {
        return true;
      },
      canDrag: (item?: any) => {
        return true;
      },
      onDragEnter: (item?: any, event?: DragEvent) => {
        // return string is the css classes that will be added to the entering element.
        return dragEnterClass;
      },
      onDragLeave: (item?: any, event?: DragEvent) => {
        return;
      },
      onDrop: (item?: any, event?: DragEvent) => {
        if (this._draggedItem) {
          this._insertBeforeItem(item);
        }
      },
      onDragStart: (
        item?: any,
        itemIndex?: number,
        selectedItems?: any[],
        event?: MouseEvent
      ) => {
        this._draggedItem = item;
        this._draggedIndex = itemIndex!;
      },
      onDragEnd: (item?: any, event?: DragEvent) => {
        this._draggedItem = undefined;
        this._draggedIndex = -1;
      },
    };
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }
  private _insertBeforeItem(item: any): void {
    const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
      ? (this._selection.getSelection() as any[])
      : [this._draggedItem!];

    const insertIndex = this.state.items.indexOf(item);
    const items = this.state.items.filter(
      (itm) => draggedItems.indexOf(itm) === -1
    );

    items.splice(insertIndex, 0, ...draggedItems);

    this.setState({ items }, () => {
      this.props.updateDataCollection(this.state.items);
    });
  }
  private deleteClicked(itemIndex: number) {
    let rresponse = confirm("Are you sure you want to delete the item");
    if (rresponse) {
      let coll = this.state.items;
      coll.splice(itemIndex, 1);
      this.setState({
        items: [...coll],
      });
      this.props.updateDataCollection(coll);
    }
  }
  private editClicked(item: IItemObject) {
    this.props.onEdit(item);
  }
  private _onItemContextMenu = (
    item: IItemObject,
    index: number,
    ev: MouseEvent
  ): boolean => {
    const contextualMenuProps: IContextualMenuProps = {
      target: ev.target as HTMLElement,
      items: [
        {
          key: "edit",
          text: "Edit",
          onClick: () => {
            this.editClicked(item);
          },
        },
        {
          key: "delete",
          text: "Delete",
          onClick: () => {
            this.deleteClicked(index);
          },
        },
      ],
      onDismiss: () => {
        this.setState({
          contextualMenuProps: undefined,
        });
      },
    };

    if (index > -1) {
      this.setState({
        contextualMenuProps: contextualMenuProps,
      });
    }

    return false;
  }
  public render(): JSX.Element {
    return (
      <div className={styles.propertyPaneLinks}>
        <DetailsList
          items={this.state.items}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.single}
          getKey={(item: any, index?: number): string => {
            return item.key;
          }}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selection={this._selection}
          dragDropEvents={this._dragDropEvents}
          checkboxVisibility={CheckboxVisibility.hidden}
          onItemContextMenu={this._onItemContextMenu}
          constrainMode={ConstrainMode.horizontalConstrained}
        />
        {this.state.contextualMenuProps && (
          <ContextualMenu {...this.state.contextualMenuProps} />
        )}
      </div>
    );
  }
}
