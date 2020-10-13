// create the MongoDB URI

// TODO: get new MongoDB URI
const dbDev = {
  protocol: 'mongodb+srv',
  user: 'koios-usr',
  password: process.env.MONGODB_PWD,
  host: 'cluster0.arkws.mongodb.net',
  db: 'koiosTest'
};

const dbProd = {
  protocol: 'mongodb+srv',
  user: 'koios-usr',
  password: process.env.MONGODB_PWD,
  host: 'cluster0.arkws.mongodb.net',
  db: 'koios'
};

export const createUri = env => {
  let db;
  if (env === 'production') {
    db = dbProd;
  } else {
    // return 'mongodb://localhost/koios';
    db = dbDev;
  }
  return `${db.protocol}://${db.user}:${db.password}@${db.host}/${db.db}?retryWrites=true&w=majority`;
}

// export const developmentUri = `mongodb://localhost/koios`;
export const developmentUri = createUri('development');
export const productionUri = createUri('production');
export const testUri = createUri('test');
export const databaseUri = createUri(process.env.NODE_ENV);
