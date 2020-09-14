import { IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
import { IItemObject } from "../Common/IItemObject";


export interface ICustomPropertyPaneProps {
  label:string;
  manageBtnLabel:string;
  panelHeader:string;
  value:IItemObject[];
  wpContext:any;
}

  export interface ICustomPropertyPaneState{
   isOpen:boolean;
  }

export interface ICustomPropertyPaneInternalProps extends ICustomPropertyPaneProps, IPropertyPaneCustomFieldProps {
}