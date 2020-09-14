import {
  SPHttpClient,
  SPHttpClientResponse,
  MSGraphClient,
} from "@microsoft/sp-http";
import { escape } from "@microsoft/sp-lodash-subset";
import { Text } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IItemObject } from "../Common/IItemObject";
export class UserServices {
  constructor(public context: WebPartContext) {}

  public getLinks(linkColl: IItemObject[]) {
    var that = this;
    return new Promise((res, rej) => {
      that
        .getAllGroups()
        .then((groups: any[]) => {
          let coll = that.getFilteredLinks(linkColl, groups);
          if (coll["message"] == "") {
            res(coll["links"]);
          } else {
            rej(coll["message"]);
          }
        })
        .catch((err) => {
          let coll = that.getFilteredLinks(linkColl, undefined);
          if (coll["message"] == "") {
            res(coll["links"]);
          } else {
            rej(coll["message"]);
          }
        });
    });
  }

  private getFilteredLinks(linkColl: IItemObject[], groupColl: any[]) {
    let coll = linkColl.filter((o1) => {
      if (o1.targetgroup && o1.targetgroup.length > 0) {
        if (groupColl && groupColl.length > 0) {
          return o1.targetgroup.some((o3) => {
            return (
              groupColl.some((o2) => {
                return (
                  o2.displayName == o3["text"] &&
                  o3["loginName"].indexOf(o2.id) > 0
                );
              }) ||
              o3["loginName"].indexOf(this.context.pageContext.user.loginName) >
                0
            );
          });
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    let collObj = {
      links: [],
      message: "",
    };
    if (coll.length > 0) {
      collObj["links"] = coll;
    } else {
      collObj["message"] = "No links found";
    }
    return collObj;
  }
  private getAllGroups() {
    var that = this;
    return new Promise((res, rej) => {
      that.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
            .api("me/memberOf/microsoft.graph.group")
            .version("v1.0")
            .select(["displayName", "mail", "id", "securityIdentifier"])
            .get()
            .then((groups) => {
              if (groups) {
                res(groups.value);
              } else {
                rej("no groups found");
              }
            })
            .catch((err) => {
              console.log("error in getting memebrs");
              console.log(err);
              rej("error in getting groups");
            });
        })
        .catch((err) => {
          console.log("error in getting ms client");
          rej("error in getting ms client");
        });
    });
  }
}
