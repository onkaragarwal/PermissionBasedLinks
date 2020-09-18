import {
  SPHttpClient,
  SPHttpClientResponse,
  MSGraphClient,
} from "@microsoft/sp-http";
import { escape } from "@microsoft/sp-lodash-subset";
import { Text } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IItemObject } from "../Common/IItemObject";
export class DirectoryService {
  constructor(public context: WebPartContext) {}
  public getNameOrEmail(objectId: string[]) {
    var that = this;
    return new Promise((res, rej) => {
      that.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
            .api("directoryObjects/getByIds")
            .version("v1.0")
            .select(["displayName", "mail", "id"])
            .post({
              ids: objectId,
              types: ["group"],
            })
            .then((result) => {
              let defaultUsersColl: string[] = [];
              for (let user of result.value) {
                //console.log(user);
                defaultUsersColl.push(
                  user["mail"] && user["mail"] != ""
                    ? user["mail"]
                    : user["displayName"]
                );
              }
              res(defaultUsersColl);
            })
            .catch((err) => {
              console.log(err);
              //rej("error in getting directory object");
              res([])
            });
        })
        .catch((err) => {});
    });
  }
}
