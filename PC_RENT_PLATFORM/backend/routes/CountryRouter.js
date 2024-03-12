const express = require("express");
const router = express.Router();
const CountryModel = require("../model/CountryModel");

router.post("/", async (req, res) => {
  try {
    const { countryName, countryShort } = req.body;
    const newCountry = new CountryModel({ countryName, countryShort });
    await newCountry.save();
    console.log(newCountry.getInstance());
    res.send(newCountry.getInstance());
  } catch (err) {
    console.error(err);
    if (err.errno === 1062) {
      res.send("Įterpimas negalimas, toks įrašas jau egzistuoja");
    } else {
      res.status(500).send("Serverio klaida");
    }
  }
});

router.get("/", async (req, res) => {
  const allCountries = await CountryModel.findAll();
  const allCountriesWithId = allCountries.map((value) => value.getInstance());
  res.send(allCountriesWithId);
});

router.get("/:id", async (req, res) => {
  const country = await CountryModel.findById(req.params.id);
  res.send(country.getInstance());
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteCountry = await CountryModel.deleteById(req.params.id);
    res.send({ message: "Instance successfully deleted" });
  } catch (err) {
    if (err.message === "Not found")
      res.status(404).send("Instance with this id doesn't exist");
    else res.status(500).send("Server error");
  }
});
router.put("/:id", async (req, res) => {
  const { countryName, countryShort } = req.body;
  const countryObj = await CountryModel.findById(req.params.id);
  if (countryName) countryObj.countryName = countryName;
  if (countryShort) countryObj.countryShort = countryShort;

  await countryObj.update();
  res.send(countryObj.getInstance())
});
module.exports = router;
