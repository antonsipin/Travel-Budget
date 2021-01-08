const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const renderTripReport = (req, res) => {
  res.render('summary')
}

const allTrips = async (req, res) => {
  const allTrips = await Trip.find();
  res.render('allTrips', {allTrips})
}

const findCategoryById = async (req, res) => {
  let newTrip = await Trip.findOne({name: req.body.tripName})
  let category = await Category.findById(req.params.id);
  let categoryName = category.name;

  res.render('editCategory', {newTrip, categoryName, category})
}

const editCategoryEqually = async (req, res) => {
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  let category = await Category.findById(req.params.id);
  let { name, cost, users } = req.body.category;

  category.name = name ;
  category.cost = cost ;
  
  let userString = users.join();
  let newusers = userString.split(',');
  users = newusers;

  let payerCost = Math.round(cost / users.length)
  let payerCostArr = []
  for (let i = 0; i < users.length; i++) {
    payerCostArr.push({ name: users[i], cost: payerCost })
  }

  if (name && cost && users) {
    try {

  category.users = payerCostArr;

      let categoryName = name;
      let payers = users;
      let newCategory = category;

      await category.save();

      res.render('equally', { categoryName, payers, payerCost, newCategory, newTrip })

    } catch (e) {
      console.log(e);
      res.render('createcategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('createcategory', {error: 'Not all fields are filled!'})
}
}

const findTripById = async (req, res) => {
  let trip = await Trip.findById(req.params.id);
  let allCategories = await Category.find({ trip: trip.name });

  let users = []
  for (let i = 0; i < allCategories.length; i++) {
    users.push(allCategories[i].users)
  }

  let names = []
  let usersArr = users.flat()


  for (let i = 0; i < usersArr.length; i++) {
    names.push(usersArr[i].name)
  }
  
  resultNames = [...new Set(names)]
  
  let userSpent = 0;
  let resulCostArr = [];

  for (let i = 0; i < resultNames.length; i++) {
    for (let j = 0; j < usersArr.length; j++) {
      if (usersArr[j].name === resultNames[i]) {
        userSpent += Number(usersArr[j].cost)
      }
    }
    resulCostArr.push({ name: resultNames[i], cost: userSpent })
    userSpent = 0;
  }

  let maxSum = 0;
  for (let i = 0; i < resulCostArr.length; i++) {
    maxSum += resulCostArr[i].cost
  }
  let maxSumObj = { name: 'All ', cost: maxSum }
  resulCostArr.push(maxSumObj)
  
  let result = ''
  for (let i = 0; i < resultNames.length; i++) {
     result += `'${resultNames[i]}',`
  }
  let sum = 0
  let resultCost = []
  for (let i = 0; i < resulCostArr.length - 1; i++) {
    resultCost[i] = resulCostArr[i].cost
    sum += resulCostArr[i].cost
  }

  let src = `https://quickchart.io/chart?c={type:'pie',data:{labels:[${result}], datasets:[{data:[${resultCost}]}]}}`
  
  let src2 = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${result}],datasets:[{data:[${resultCost}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${sum}',font:{size:20}},{text:'total'}]}}}}`

  let qrSrc = `https://quickchart.io/qr?text=mail.ru`
 
  res.render('summary', { trip, allCategories, resultNames, resulCostArr, maxSumObj, src, src2, qrSrc} );
}

const renderNewtrip = (req, res) => {
  res.render('newtrip')
}

const createNewTrip = async (req, res) => {
  let tripName = req.body.newTripName;
  let tripUsers = req.body.tripUsers;
  let tripUsersResult = tripUsers.split(',')
  let newTrip

  if (tripName && tripUsers) {
    try {
          newTrip = new Trip({
          name: tripName,
          users: tripUsersResult
        })

      await newTrip.save()
      res.render('createcategory', { tripName, tripUsersResult, newTrip })

    } catch (e) {
      console.log(e);
      res.render('newtrip', { error: 'This trip already exist or incorrect data!', tripName, tripUsersResult, newTrip  })
    }
  } else {
    res.render('newtrip', {error: 'Not all fields are filled!', tripName, tripUsersResult, newTrip})
} 
}

const renderCreateCategory = (req, res) => {
  let tripName = req.body.tripName;
  res.render('createcategory', { tripName })
}

const addCategory = async (req, res) => {
  let newTrip = await Trip.findOne({ name: req.body.tripName})
  res.render('createcategory', { newTrip  })
}

const createNewCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let cost = req.body.fullCost;
  let tripId = req.body.tripId;
  let newTrip = await Trip.findById(tripId)
  let payers = newTrip.users
  let tripCategories = newTrip.categories
  let newCategory
  let tripName = newTrip.name
  let payerCost = Math.round(cost / payers.length)
  let payerCostArr = []
  for (let i = 0; i < payers.length; i++) {
    payerCostArr.push({ name: payers[i], cost: payerCost })
  }

  if (categoryName && cost && payers) {
    try {

        newCategory = new Category({
        name: categoryName,
        cost,
        users: payerCostArr,
        trip: tripName
      })
      
      tripCategories.push(newCategory)
      newTrip.categories = tripCategories

      await newCategory.save()
      await newTrip.save()

      res.render('equally', { categoryName, payers, payerCost, tripName , newCategory, newTrip})

    } catch (e) {
      console.log(e);
      res.render('createcategory', { error: 'This category already exist or incorrect data!', categoryName, payers, payerCost, tripName , newCategory, newTrip })
    }
  } else {
    res.render('createcategory', {error: 'Not all fields are filled!', categoryName, payers, payerCost, tripName , newCategory, newTrip})
}
}

const renderCastomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let newTrip = await Trip.findOne({ name: req.body.tripName });
  let fullCost = req.body.fullCost;
  let payers = req.body.payers;
  res.render('castomizeCategory', { newTrip, categoryName, fullCost, payers });
}

const castomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let fullCost = req.body.fullCost;
  let payers = req.body.payers;
  let newTrip = await Trip.findOne({ name: req.body.tripName });

  if (categoryName && fullCost && payers) {
    try {
      
      res.render('castomizeCategory', { categoryName, payers, fullCost, newTrip });

    } catch (e) {
      console.log(e);
      res.render('castomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('castomizeCategory', {error: 'Not all fields are filled!'})
}
}

const editCategoryCastomize = async (req, res) => {
  let category = await Category.findById(req.body.categoryId);
  let newTrip = await Trip.findOne({name: category.trip});
  let categoryName = category.name;
  let fullCost = category.cost;
  let payersObject = category.users;
  let payers = payersObject.map((el) => {
    return el.name
  })

  if (categoryName && fullCost && payers) {
    try {
      
      res.render('editCastomizeCategory', { category, categoryName, payers, fullCost, newTrip });

    } catch (e) {
      console.log(e);
      res.render('editCastomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('editCastomizeCategory', {error: 'Not all fields are filled!'})
}
}

const renderSavedCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let newTrip = await Trip.findOne({name: req.body.tripName})
  res.render('savedCastomizeCategory', {categoryName, castomCost, payers, newTrip})
}

const saveCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let fullCost = req.body.fullCost;
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  let castomCostArr = [];

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
    try {
      const newCategory = new Category({
        name: categoryName,
        cost: fullCost,
        users: castomCostArr,
        trip: newTrip
      })

      await newCategory.save()
      res.render('savedCastomizeCategory', {categoryName, castomCostArr, payers, newTrip})
      
    } catch (e) {
      console.log(e);
      res.render('savedCastomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('savedCastomizeCategory', {error: 'Not all fields are filled!'})
}
}

const saveEditCastom = async (req, res) => {
  let category = await Category.findById(req.body.categoryId)
  let categoryName = category.name;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let fullCost = category.cost;
  let newTrip = await Trip.findOne({ name: category.trip });
  let castomCostArr = [];

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
        category.name = categoryName,
        category.cost = fullCost,
        category.users = castomCostArr,
        category.trip = newTrip.name
    try {

      await category.save()
      res.render('savedCastomizeCategory', {categoryName, castomCostArr, payers, newTrip})
      
    } catch (e) {
      console.log(e);
      res.render('savedCastomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('savedCastomizeCategory', {error: 'Not all fields are filled!'})
}
}

module.exports = {
  renderNewtrip,
  renderCreateCategory,
  createNewTrip,
  createNewCategory,
  renderCastomizeCategory,
  castomizeCategory,
  renderSavedCastomizeCategory,
  saveCastomizeCategory,
  renderTripReport,
  allTrips,
  findTripById,
  addCategory,
  findCategoryById,
  editCategoryEqually,
  editCategoryCastomize,
  saveEditCastom
}
