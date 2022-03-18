use admin;

errorHandler = function (action, errorAction) {
  try {
    action()
  } catch (ex) {
    print(ex)
    if (errorAction != null) errorAction()
  }
}

errorHandler(
  () =>
    db.createUser({
      user: 'application-client',
      pwd: 'pass.123',
      roles: [{ role: 'readWrite', db: 'client' }]
    }),
  () =>
    db.grantRolesToUser('application-client', [
      { role: 'readWrite', db: 'client' }
    ])
)

errorHandler(
  () =>
    db.createUser({
      user: 'db-migration-client',
      pwd: 'pass.123',
      roles: [
        { role: 'readWrite', db: 'client' },
        { role: 'dbAdmin', db: 'client' }
      ]
    }),
  () =>
    db.grantRolesToUser('db-migration-client', [
      { role: 'readWrite', db: 'client' },
      { role: 'dbAdmin', db: 'client' }
    ])
)

errorHandler(() =>
  db.createRole(
    {
      role: 'ArchivalUser',
      privileges: [
        {
          resource: { db: '', collection: '' },
          actions: ['find', 'createIndex', 'createUser', 'insert']
        }
      ],
      roles: [{ role: 'backup', db: 'admin' }]
    },
    { w: 'majority', wtimeout: 5000 }
  )
)

errorHandler(
  () =>
    db.createUser({
      user: 'archival',
      pwd: 'pass.123',
      roles: ['ArchivalUser']
    }),
  () => db.grantRolesToUser('archival', ['ArchivalUser'])
)
