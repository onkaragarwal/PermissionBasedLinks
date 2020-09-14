import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
} from "@microsoft/sp-property-pane";
import {
  ICustomPropertyPaneInternalProps,
  ICustomPropertyPaneProps,
  ICustomPropertyPaneState,
} from "./ICustomPropertyPane";
import { CustomPropertyPaneControl } from "./CustomPropertyPaneControl";

export class CustomPropertyPane
  implements IPropertyPaneField<ICustomPropertyPaneProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: ICustomPropertyPaneInternalProps;
  private elem: HTMLElement;
  private _onChangeCallback: (targetProperty?: string, newValue?: any) => void;

  constructor(targetProperty: string, properties: ICustomPropertyPaneProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      key: properties.label,
      ...properties,
      onRender: this.render.bind(this),
      onDispose: this.dispose.bind(this),
    };
  }

  private render(
    elem: HTMLElement,
    context?: any,
    changeCallback?: (targetProperty?: string, newValue?: any[]) => void
  ) {
    if (!this.elem) {
      this.elem = elem;
    }
    const element = React.createElement(CustomPropertyPaneControl, {
      ...this.properties,
      onChanged: this.onChanged.bind(this),
    });
    ReactDOM.render(element, elem);
    if (changeCallback) {
      this._onChangeCallback = changeCallback;
    }
  }
  private dispose(element: HTMLElement) {
    ReactDOM.unmountComponentAtNode(element);
  }
  private onChanged(value: any[]): void {
    if (this._onChangeCallback) {
      this._onChangeCallback(this.targetProperty, value);
    }
  }
}

/*
export class CustomPropertyPane
  implements IPropertyPaneField<IPropertyPaneCustomFieldProps> {
  public type: any = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneCustomFieldProps;

  private config: ICustomPropertyPaneInternalProps;
  private currentValue: string = "";
  constructor(
    targetProperty: string,
    config: ICustomPropertyPaneInternalProps,
    context?: any
  ) {
    this.targetProperty = targetProperty;
    this.properties = {
      key: "MyCustomControl",
      context: context,
      onRender: this.render.bind(this),
      onDispose: this.dispose.bind(this),
    };
    this.config = config;
    this.properties.onRender = this.render.bind(this);
    this.properties.onDispose = this.dispose.bind(this);
  }

  private render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any[]) => void): void {
    //const props: IPropertyFieldCollectionDataProps = <IPropertyFieldCollectionDataProps>this.properties;

    const element = React.createElement(CustomPropertyPaneControl, {
     
    });

    ReactDOM.render(element, elem);

    // if (changeCallback) {
    //   this._onChangeCallback = changeCallback;
    // }
  }

 
  private dispose(elem: HTMLElement) {
    
  }

  // /**
  //  * On field change event handler
  //  * @param value
  //  */
// private onChanged(value: any[]): void {
//   if (this._onChangeCallback) {
//     this._onChangeCallback(this.targetProperty, value);
//   }
// }
//}
