import * as mongoose from "mongoose";

export const UserSearched = new mongoose.Schema({
  name: { type: String, required: true },
  searched: { type: String, required: true },
});

export const UserModal = mongoose.model("UserSearched", UserSearched);

export const create = (values: Record<string, any>) =>
  new UserModal(values).save().then((user) => user.toObject());
