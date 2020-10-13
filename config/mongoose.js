import { connect } from 'mongoose';
import { createUri } from './db';

export default (env = process.env.NODE_ENV) => connect(createUri(env), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true
});
