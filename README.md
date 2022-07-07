# StateDb

Little wrapper around lowdb, for persitence of states.

## Usage:

### new StateDb (dbPath, [appkey], [options]);

StateDb create a file at `dbPath` and add `.db` extensions.
So, if you pass `/mount/app.settings` the result in the filesystem is
`/mount/app.settings.db`

With the `appkey` you can categorize your app/domain in the db file.
For example, if you wanna persist another domain in the same file you can
do:

```js
const myDbPath = '/mount/local/file';
const UsersDb = new StateDb(myDbPath, 'users');
const CustomersDb = new StateDb(myDbPath, 'customers');
```

If the `appkey` is omitted, the `dbPath` will be used as `appkey`.
This behavior create an hard link with the db location and the content.
If you try to open the Db with another path, the content is reseted.

In general, if you provide a database as ressource, don't ommit the `appkey`.

### saveState ('state key', value)

Save something at `state key`.

### loadState ('state key')

Load something that reside at `state key`.

## Example:

```js
import StateDb from 'statedb';

async function main() {
  const myDbPath = '/mount/local/burritos';
  const savedSettings = new StateDb(myDbPath, 'settings');
  const savedUsers = new StateDb(myDbPath, 'users');

  await savedSettings.init();
  await savedUsers.init();

  // saving
  savedSettings.saveState('bobSettings', {
    x: 800,
    y: 600,
    locale: 'en_US',
  });

  // loading
  const settings = savedSettings.loadState('settings');
  // todo: do some magic with loaded settings...
}

main();
```
