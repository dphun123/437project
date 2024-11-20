import { Schema, model } from "mongoose";
import { Entry } from "../models";

const EntrySchema = new Schema<Entry>(
  {
    username: String,
    exercise_ref: { type: String, required: true },
    exercise_name: { type: String, required: true },
    date_added: { type: Date, required: true, default: Date.now },
    sets: [
      {
        weight: { type: Number, required: true },
        repetitions: { type: Number, required: true },
      },
    ],
    comment: String,
    last_modified: { type: Date, default: Date.now },
  },
  { collection: "entry" }
);

const EntryModel = model<Entry>("Entry", EntrySchema);

function index(): Promise<Entry[]> {
  return EntryModel.find();
}

function getEntriesByExercise(
  username: String,
  exercise_ref: String
): Promise<Entry[] | null> {
  return EntryModel.find({ username, exercise_ref })
    .then((entries) => entries)
    .catch((err) => {
      throw `$No entries for ${exercise_ref} found.`;
    });
}

function getEntryById(_id: String): Promise<Entry | null> {
  return EntryModel.findOne({ _id })
    .then((entry) => entry)
    .catch((err) => {
      throw `$No entry with id ${_id} found.`;
    });
}

function create(json: Entry): Promise<Entry> {
  const entry = new EntryModel(json);
  return entry.save();
}

function update(_id: String, entry: Entry): Promise<Entry> {
  return EntryModel.findOneAndUpdate({ _id }, entry, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `$Entry {_id} not updated.`;
    else return updated as Entry;
  });
}

function remove(_id: String): Promise<void> {
  return EntryModel.findOneAndDelete({ _id }).then((deleted) => {
    if (!deleted) throw `Entry ${_id} not deleted.`;
  });
}

export default {
  index,
  getEntriesByExercise,
  getEntryById,
  create,
  update,
  remove,
};
