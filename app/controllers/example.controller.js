import * as datamappers from "../models/index.datamapper.js";

export default {
    async getExample(req, res) {
        try {
            const example = await datamappers.exampleDatamapper.findAll();

            if (!example)
                throw new Error("Example not found", { cause: { code: 404 } });

            return res.json({ example });
        } catch (err) {
            if (err.cause) {
                const { code } = err.cause;
                return res.status(code).json({ error: err.message });
            }

            return res
                .status(500)
                .json({ error: `Internal Server Error: ${err.message}` });
        }
    },
};
