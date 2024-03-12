const executeQuery = require("../mysql");

module.exports = class CountryModel {
  #id; // groteles pries laukelio pavadinima reiskia kad laukelis bus privatus ir nereadaguotinas is isores
  countryName;
  countryShort;

  constructor({ countryName, countryShort }, id = null) {
    this.#id = id;
    this.countryName = countryName;
    this.countryShort = countryShort;
  }

  get id() {
    return this.#id;
  }

  async save() {
    const results = await executeQuery(
      `INSERT INTO countries (country_name, country_short) VALUES (?, ?)`,
      [this.countryName, this.countryShort]
    );
    this.#id = results[0].insertId;
    console.log(results);
  }

  static async findAll() {
    const results = await executeQuery(`SELECT * FROM countries`);
    const result = results[0].map(
      (result) =>
        new CountryModel(
          {
            countryName: result.country_name,
            countryShort: result.country_short,
          },
          result.id
        )
    );

    console.log(result);
    return result;
  }

  static async findById(id) {
    const results = await executeQuery(`SELECT * FROM countries WHERE id=?`, [
      id,
    ]);
    const result = results[0][0]
    console.log(results);
    return new CountryModel({countryName: result.country_name, countryShort: result.country_short}, result.id)
  }

  static async deleteById(id) {
    const results = await executeQuery(`DELETE FROM countries WHERE id=?`, [id]);
    if(results[0].affectedRows === 0)
    {
        throw new Error('Not found');
    }
    return results;
  }

  async update() {
    const results = await executeQuery(
      `UPDATE countries SET country_name =?, country_short =? WHERE id =?`,
      [this.countryName, this.countryShort, this.id]
    );
    console.log(results);
    return results;
  }

  getInstance() {
    return { ...this, id: this.#id };
  }
};
