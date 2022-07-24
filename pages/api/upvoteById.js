import { findRecordByFilter, getShopRecords, table } from "../../lib/airtable";

const upvoteById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVotes = parseInt(record.votes) + 1;
          // console.log({ calculateVotes });

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                votes: calculateVotes,
              },
            },
          ]);

          if (updateRecord) {
            const shopRecords = getShopRecords(updateRecord);
            res.json(shopRecords);
          }
        } else {
          res.json({ message: `Coffee shop with id of ${id} could not be found.` });
        }
      } else {
        res.status(400);
        res.json({ message: "Required parameter 'id' is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: `There was a problem adding your vote: ${error}` });
    }
  } else {
    return;
  }
};

export default upvoteById;
