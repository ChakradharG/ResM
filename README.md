# ResM
This is an all-in-one resource manager where you can store links to webpages, code snippets, pieces of text, links to local files etc. and search for them as and when the need arises.

<br>

## Getting Started
* Install MySQL (v8 or newer) and make sure that MySQL server is running in the background 
* Clone this repository (main branch)
* Execute `npm install`
* `cd ResM/Database_Backup` and execute `mysql -u root -p < ResM-Blank.sql` (where root is your MySQL username) to setup a blank database and its schema
* Edit `.env-sample` file and replace the placeholders with your MySQL server hostname, username and password
* You may change the port variable if you want to
* Rename `.env-sample` to `.env`

<br>

## How to Use
* Execute `npm run start` to start the backend server
* Go to `localhost:` followed by the port number (the default is 5500) and start adding resources
* You can add tags and project tags to a resource in addition to a name, link and content/description
* The project tags are special tags that you can use to link resources to your projects. Clicking on a project tag redirects to the project url (provided you have added a url to that project tag)
* You may add a &lt;pre> block in the content section of a resource to display it as is, i.e with the original formatting
* You may add a &lt;code> block in the content section of a resource to highlight a single-line code snippet (for multi-line code snippets, use &lt;pre class="code">)
* After adding a few resources, start typing into the search bar to search for resources (resources appear as cards below the search bar)
* Click on a card to expand it
* To search for resources that have a specific tag, prepend the tag name with `~:tag:` in the search bar, i.e `~:tag:foo` to get all the resources that have the `foo` tag
* To search for resources that have a specific project tag, prepend the project name with `~:pro:` in the search bar, i.e `~:pro:bar` to get all the resources that have the `bar` project tag
* To list all the resources, type `~:all:` into the search bar
* You can also add local files (those that can be opened by a browser) to ResM. In order to do so, copy the desired file into the Local_Resources directory, then create a resource card for the file and set its link to `/Local_Resources/` followed by the file name, i.e `/Local_Resources/foobar.txt` for a file named foobar.txt
* To get a backup of your database, run the file `Generate ResM-Dump.bat` (for Windows) or execute the command `mysqldump -u root -p --databases ResM > ResM-Dump.sql`
* To restore your database from a backup file, copy the `ResM-Dump.sql` into the Database_Backup directory and run the file `Restore ResM-Dump.bat` or execute the command `mysql -u root -p < ResM-Dump.sql`
