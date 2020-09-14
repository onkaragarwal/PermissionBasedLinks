import {
    ICustomPropertyPaneProps,
  } from "./ICustomPropertyPane";
  import { IItemObject } from "../Common/IItemObject";

export interface ICustomPropertyPaneControlState{
    panelOpen:boolean;
    nestedPanelOpen:boolean;
    linklist:IItemObject[];
    key:number;
    isNew:boolean;
    editItemData:IItemObject;
}

export interface ICustomPropertyPaneControlProps extends ICustomPropertyPaneProps{
   
    onChanged: (value: any[]) => void;
}