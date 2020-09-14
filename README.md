## button-quick-links

This webpart shows button based links based on permission. The concept is similar to existing quick links webparts but this is based on permission and is restriced to only button based layout.
![Image of Quick links](/image/Quick%20Links.PNG)
### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

After build create the package by running below commands

```bash
git bundle --ship
gulp package-solution --ship
```

Deploy the solution to appcatalog and add it on the site.
Add it on the page and edit the webpart.Following panel will open.

![Image of edit page](/image/editpage.PNG)

Click on **Manage Links** button.Empty panel opens up.
Click on New.Form will open up as shown below

![Image of form](/image/Form.PNG).

Fill in details.
- Title: Title of the link
- Description: Description of link
- Url: Link url
- Target Group: group/users to whom the links is to be shown.If it is empty then the link will be shown to all. User/Group selection is limited to 5 for now but you can go and change in code
- Target: link target

Click Add.Item will be visible in table.Once all items are added then you need to click on **Save** in the manage link to save the data in webpart properties otherwise data will be lost once you go out of page.

![Image of table](https://github.com/onkaragarwal/PermissionBasedLinks/blob/master/image/links.png)

For editing and deleting right click on element and contextual menu will appear.





