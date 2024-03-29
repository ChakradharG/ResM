# ResM
This is an all-in-one resource manager where you can store links to webpages, code snippets, pieces of text, links to local files etc. and search for them as and when the need arises.

<br>

## Getting Started
* Clone this repository
* `cd ResM`
* Execute `npm install`
* `cd Database` and execute either `node ResM-Blank.js` or `sqlite3 ResM.db < ResM-Blank.sql` (requires the [SQLite command-line tools](https://sqlite.org/download.html) to work) to setup a blank database and its schema
* You can also use the following commands to setup a blank database and its schema
```
sqlite3 ResM.db
.read ResM-Blank.sql
```
* Edit `package.json` and set the icon's extension depending upon your OS (`.ico` for Windows, `.png` for Linux and `.icns` for MacOS)
* Execute `npm run make`
* The executable application will be created in the `ResM/out/resm-{architecture}/` directory

<br>

## How to Use
* Run the applicaton and start adding resources
* You can add tags and project tags to a resource in addition to a name, link and content/description
* The project tags are special tags that you can use to link resources to your projects. Clicking on a project tag redirects to the project url (provided you have added a url to that project tag)
* You may add a &lt;pre> block in the content section of a resource to display it as is, i.e with the original formatting
* You may add a &lt;code> block in the content section of a resource to highlight a single-line code snippet (for multi-line code snippets, use &lt;pre class="code">)
* After adding a few resources, start typing into the search bar (powered by RegEx) to search for resources (resources appear as cards below the search bar)
* Click on a card to expand it
* To search for resources that have a specific tag, prepend the tag name with `~:hastag:` (or `~:ht:`) in the search bar, i.e `~:hastag:foo` to get all the resources that have the `foo` tag
* To search for resources that have a specific project tag, prepend the project name with `~:haspro:` (or `~:hp:`) in the search bar, i.e `~:haspro:bar` to get all the resources that have the `bar` project tag
* To list all resources, type `~:all:` (or `~:a:`) into the search bar
* To list all tags, type `~:tags:` (or `~:t:`) into the search bar
* To list all project tags, type `~:pros:` (or `~:p:`) into the search bar
* You can also add local files to ResM (will be opened in the default app associated for that file on your computer). In order to do so, copy the desired file into the `ResM/out/resm-{architecture}/resources/app/Local_Resources/` directory, then create a resource card for the file and set its link to `/Local_Resources/` followed by the file name, i.e `/Local_Resources/foobar.txt` for a file named foobar.txt
* To get a backup of your database, go to `ResM/out/resm-{architecture}/resources/app/Databse/` directory and execute either `sqlite3 ResM.db .dump > ResM-Dump.sql` or the following commands
```
sqlite3 ResM.db
.once ResM-Dump.sql
.dump
```
* To restore your database from a backup file, copy the `ResM-Dump.sql` file into `ResM/out/resm-{architecture}/resources/app/Databse/` directory and execute either `sqlite3 ResM.db < ResM-Dump.sql` or the following commands
```
sqlite3 ResM.db
.read ResM-Dump.sql
```

<br>

## Demo
![](Assets/Demo/IMG_1.jpg)
![](Assets/Demo/IMG_2.jpg)
![](Assets/Demo/IMG_3.jpg)
![](Assets/Demo/IMG_4.jpg)
![](Assets/Demo/IMG_5.jpg)
![](Assets/Demo/IMG_6.jpg)
