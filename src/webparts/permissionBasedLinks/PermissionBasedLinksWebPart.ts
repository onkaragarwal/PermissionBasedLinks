import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "PermissionBasedLinksWebPartStrings";
import PermissionBasedLinks from "./components/PermissionBasedLinks";
import { IPermissionBasedLinksProps } from "./components/IPermissionBasedLinksProps";
import { CustomPropertyPane } from "./PropertyPane/CustomPropertyPane";
import { IItemObject } from "./Common/IItemObject";
import PnPTelemetry from "@pnp/telemetry-js";


const telemetry = PnPTelemetry.getInstance();
telemetry.optOut();

export interface IPermissionBasedLinksWebPartProps {
  description: string;
  links: IItemObject[];
}

export default class PermissionBasedLinksWebPart extends BaseClientSideWebPart<
  IPermissionBasedLinksWebPartProps
> {
  public render(): void {
   
    const element: React.ReactElement<IPermissionBasedLinksProps> = React.createElement(
      PermissionBasedLinks,
      {
        links: this.properties.links,
        context:this.context
      }
    );
   
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                new CustomPropertyPane("links", {
                  label: strings.ButtonFieldLabel,
                  manageBtnLabel: strings.ButtonFieldLabel,
                  panelHeader: strings.PanelHeaderText,
                  value: this.properties.links,
                  wpContext:this.context
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
