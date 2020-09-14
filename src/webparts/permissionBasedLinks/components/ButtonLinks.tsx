import * as React from "react";
import styles from "./PermissionBasedLinks.module.scss";
import { IPermissionBasedLinksProps } from "./IPermissionBasedLinksProps";
import { IItemObject } from "../Common/IItemObject";
import {
  Label,
  Image,
  ImageFit,
  MessageBar,
  MessageBarType,
  FontIcon,
  List,
  ProgressIndicator,
  getTheme,
  FocusZone,
  DocumentCard,
  DocumentCardDetails,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardType,
  FontSizes,createTheme,ITheme,
  IDocumentCardPreviewProps,
} from "@fluentui/react";
import { UserServices } from "../Services/UserData";
import { initializeIcons } from "@uifabric/icons";
initializeIcons();
const ThemeColorsFromWindow: any = (window as any).__themeState__.theme;
const siteTheme: ITheme = createTheme({ //pass this object to your components
  palette: ThemeColorsFromWindow
});
export interface IButtonLinksProps {
  link: IItemObject;
  showDescription: boolean;
  showIcon?: boolean;
  width:number;
}
export interface IButtonLinksState {
    height:number;
}
export class ButtonLinks extends React.Component<
  IButtonLinksProps,
  IButtonLinksState
> {
    constructor(props){
        super(props);
        this.state={
           height:78
        };
    }
  public render() {
    const item = this.props.link;
    const itemWidth=this.props.width;
    return (
      <div style={{ margin: "0px 10px 14px", position: "relative" }} className={styles.btnLinksDiv}>
        <div style={{ width: `${itemWidth}px` }}>
          <DocumentCard
            type={DocumentCardType.compact}
            aria-label={item.title}
            onClickHref={item.url}
            onClickTarget={item.target}
            styles={{root:{backgroundColor: siteTheme.palette.themePrimary , color:siteTheme.palette.neutralPrimary }}}
          >
            <DocumentCardPreview
             styles= {{ previewIcon: { backgroundColor: siteTheme.palette.themePrimary  } }}
              previewImages={[
                {
                  previewIconProps: {
                    iconName: item.iconname,
                    styles: {
                      root: {
                        fontSize: FontSizes.xxLarge,
                        color:siteTheme.palette.white
                      },
                    },
                  },
                  width: 60,
                },
              ]}
            />
            <DocumentCardDetails styles={{root:{height:this.state.height}}}>
              <DocumentCardTitle title={item.title} />
             {this.props.showDescription&&(<div className={styles.btnLinkDescriptionWrapper}>
                 <div className={styles.btnLinkDescriptionTitle} title={item.description} style={{color:siteTheme.palette.white}}>
                 {item.description}
                 </div>
             </div>)}
            </DocumentCardDetails>
          </DocumentCard>
        </div>
      </div>
    );
  }
}


/**
 * 
 * 
 *   case n.SingleLine:
                                    w(u, { minHeight: 20 }), i === n.SingleLine && w(u, { height: 39 }), i === n.TwoLines && w(u, { height: 58 });
                                    break;
                                case n.TwoLines:
                                    w(u, { minHeight: 40 }), i === n.SingleLine && w(u, { height: 59 }), i === n.TwoLines && w(u, { height: 78 });
                                    break;
                                case n.TwoLinesAutoCollapse:
                                    w(u, { minHeight: 20, height: "auto" });
 */