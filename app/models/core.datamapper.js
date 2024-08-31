export default class CoreDatamapper {
    client;

    tableName;

    constructor(client) {
        this.client = client;
    }

    async findAll() {
        const [rows] = await this.client.query(
            `SELECT * FROM \`${this.tableName}\``
        );

        return rows || null;
    }

    async findByPk(id) {
        const [rows] = await this.client.query(
            `SELECT * FROM \`${this.tableName}\` WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    async findOne(key, value) {
        const [rows] = await this.client.query(
            `SELECT * FROM \`${this.tableName}\` WHERE \`${key}\` = ?`,
            [value]
        );

        return rows[0] || null;
    }

    async findByKeyValue(key, value) {
        const [rows] = await this.client.query(
            `SELECT * FROM \`${this.tableName}\` WHERE \`${key}\` = ?`,
            [value]
        );

        return rows || null;
    }

    async create(inputData) {
        const fields = Object.keys(inputData);
        const values = Object.values(inputData);

        // Créez des placeholders pour les valeurs
        const placeholders = values.map(() => "?").join(", ");
        // Créez une chaîne pour les noms de colonnes entourés de backticks
        const fieldsString = fields.map((field) => `\`${field}\``).join(", ");

        const [result] = await this.client.query(
            `
            INSERT INTO \`${this.tableName}\` (${fieldsString})
            VALUES (${placeholders})
        `,
            values
        );

        return result.affectedRows > 0;
    }

    async update(inputData, id) {
        const fields = Object.keys(inputData);
        const values = Object.values(inputData);
        values.push(id); // Ajoutez l'ID à la fin des valeurs

        // Créez la chaîne pour les colonnes à mettre à jour avec des placeholders
        const updateColumns = fields
            .map((column) => `\`${column}\` = ?`)
            .join(", ");

        const [result] = await this.client.query(
            `
                UPDATE \`${this.tableName}\`
                SET ${updateColumns}
                WHERE \`id\` = ?
            `,
            values
        );

        // Vérifiez si la mise à jour a réussi
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await this.client.query(
            `DELETE FROM \`${this.tableName}\` WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
