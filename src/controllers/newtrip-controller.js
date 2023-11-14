const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const User = require('../models/user-model')
const { getId, getChartSourceLink } = require('../utils/index')

const renderTripReport = async (req, res) => {
  res.render('Summary')
}

const allTrips = async (req, res) => {
  const allTrips = await Trip.find({ email: req.session?.user?.email})
  res.render('AllTrips', { 
    allTrips, 
    userName: req.session?.user?.name 
  })
}

const findCategoryById = async (req, res) => {
  let newTrip = await Trip.findOne({name: req.body.tripName})
  let category = await Category.findById(req.params.id)
  let categoryName = category.name

  res.render('EditCategory', {
    newTrip, 
    categoryName, 
    category,
    userName: req.session?.user?.name,
    error: ''
  })
}

const editCategoryEqually = async (req, res) => {
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  let category = await Category.findById(req.params.id)

  let { name, cost, users } = req.body

  category.name = name 
  category.cost = cost
  
  let userString = users.join()
  let newusers = userString.split(',')
  users = newusers

  let payerCost = Math.round(cost / users.length)
  let payerCostArr = []
  for (let i = 0; i < users.length; i++) {
    payerCostArr.push({ name: users[i], cost: payerCost })
    }

  if (name && cost && users) {
    try {

      category.users = payerCostArr

      let categoryName = name
      let payers = users
      let newCategory = category

      await category.save()

      res.render('Equally', { 
        categoryName, 
        payers, payerCost, 
        newCategory, 
        newTrip,
        userName: req.session?.user?.name 
      })

    } catch (e) {
      console.log(e)
      res.render('Createcategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name  
      })
    }
  } else {
    res.render('Createcategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name 
    })
}
}

  const findTripById = async (req, res) => {
  let trip = await Trip.findById(req.params.id);
  let allCategories = await Category.find({ trip: trip.name })

  let users = []
  for (let i = 0; i < allCategories.length; i++) {
    users.push(allCategories[i].users)
  }

  let names = []
  let usersArr = users.flat()

  for (let i = 0; i < usersArr.length; i++) {
    names.push(usersArr[i].name)
  }
  
  let resultNames = [...new Set(names)]
  let userSpent = 0
  let resulCostArr = []

  for (let i = 0; i < resultNames.length; i++) {
    for (let j = 0; j < usersArr.length; j++) {
      if (usersArr[j].name === resultNames[i]) {
        userSpent += Number(usersArr[j].cost)
      }
    }
    resulCostArr.push({ id: getId(), name: resultNames[i], cost: userSpent })
    userSpent = 0
  }

  let maxSum = 0
  for (let i = 0; i < resulCostArr.length; i++) {
    maxSum += resulCostArr[i].cost
  }
  let maxSumObj = { id: getId(), name: 'All ', cost: maxSum }
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

  res.render('Summary', {
    userName: req.session?.user?.name,
    trip, 
    allCategories, 
    resultNames, 
    resulCostArr, 
    maxSumObj, 
    chartSourceLink: getChartSourceLink(result, resultCost, sum)
  } )
}

const renderNewtrip = async (req, res) => {
  res.render('NewTrip')
}

const createNewTrip = async (req, res) => {
  let tripName = req.body.newTripName
  let tripUsers = req.body.tripUsers
  let tripUsersResult = tripUsers.split(',')
  let user = await User.findOne({ email: req.session.user.email })
  let newTrip
  let trips = []
  trips.push(tripName)
  user.trips = [...user.trips, ...trips]

  if (tripName && tripUsers) {
    try {
          newTrip = new Trip({
          name: tripName,
          users: tripUsersResult,
          email: req.session.user.email
        })

      await newTrip.save()
      await user.save()

      res.render('Createcategory', { 
        tripName, 
        tripUsersResult, 
        newTrip,
        userName: req.session?.user?.name  
      })

    } catch (e) {
      console.log(e)

      res.render('NewTrip', { 
        error: 'This trip already exist or incorrect data!', 
        tripName, 
        tripUsersResult, 
        newTrip,
        userName: req.session?.user?.name  
      })
    }
  } else {
    res.render('NewTrip', { 
      error: 'Not all fields are filled!', 
      tripName, 
      tripUsersResult, 
      newTrip,
      userName: req.session?.user?.name  
    })
} 
}

const renderCreateCategory = (req, res) => {
  let tripName = req.body.tripName
  res.render('Createcategory', { 
    tripName,
    userName: req.session?.user?.name,
    error: '' 
  })
}

const addCategory = async (req, res) => {
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  res.render('Createcategory', { 
    newTrip,
    userName: req.session?.user?.name,
    error: ''  
  })
}

const createNewCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName
  let cost = req.body.fullCost
  let tripId = req.body.tripId
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

      res.render('Equally', { 
        categoryName, 
        payers, 
        payerCost, 
        tripName, 
        newCategory, 
        newTrip,
        userName: req.session?.user?.name,
        error: '' 
      })

    } catch (e) {
      console.log(e)

      res.render('Createcategory', { 
        error: 'This category already exist or incorrect data!', 
        categoryName, 
        payers, 
        payerCost, 
        tripName, 
        newCategory, 
        newTrip,
        userName: req.session?.user?.name
      })
    }
  } else {
    res.render('Createcategory', { 
      error: 'Not all fields are filled!', 
      categoryName, 
      payers, 
      payerCost, 
      tripName, 
      newCategory, 
      newTrip,
      userName: req.session?.user?.name
    })
}
}

const renderCastomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  let fullCost = req.body.fullCost
  let payers = req.body.payers
  res.render('CastomizeCategory', { 
    newTrip, 
    categoryName, 
    fullCost, 
    payers,
    userName: req.session?.user?.name 
  })
}

const castomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName
  let fullCost = req.body.fullCost
  let payers = req.body.payers
  let newTrip = await Trip.findOne({ name: req.body.tripName })

  if (categoryName && fullCost && payers) {
    try {
      
      res.render('CastomizeCategory', { 
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        userName: req.session?.user?.name 
      })

    } catch (e) {
      console.log(e)

      res.render('CastomizeCategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name  
      })
    }
  } else {
    res.render('CastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
}
}

const editCategoryCastomize = async (req, res) => {
  let category = await Category.findById(req.body.categoryId)
  let newTrip = await Trip.findOne({name: category.trip})
  let categoryName = category.name
  let fullCost = category.cost
  let payersObject = category.users
  let payers = payersObject.map((el) => {
    return el.name
  })

  if (categoryName && fullCost && payers) {
    try {
      res.render('EditCastomizeCategory', { 
        category, 
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        userName: req.session?.user?.name 
      })
    } catch (e) {
      console.log(e)

      res.render('EditCastomizeCategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name 
      })
    }
  } else {
    res.render('EditCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
}
}

const renderSavedCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName
  let castomCost = req.body.castomizeCategoryCost
  let payers = req.body.payer
  let newTrip = await Trip.findOne({name: req.body.tripName})
  res.render('SavedCastomizeCategory', {
    categoryName, 
    castomCost, 
    payers, 
    newTrip,
    userName: req.session?.user?.name
  })
}

const saveCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName
  let castomCost = req.body.castomizeCategoryCost
  let payers = req.body.payer
  let fullCost = req.body.fullCost
  let newTrip = await Trip.findOne({ name: req.body.tripName })
  let castomCostArr = []

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
    try {
      const newCategory = new Category({
        name: categoryName,
        cost: fullCost,
        users: castomCostArr,
        trip: newTrip.name
      })

      await newCategory.save()
      res.render('SavedCastomizeCategory', {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        userName: req.session?.user?.name
      })
      
    } catch (e) {
      console.log(e)

      res.render('SavedCastomizeCategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name 
      })
    }
  } else {
    res.render('SavedCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
}
}

const saveEditCastom = async (req, res) => {
  let category = await Category.findById(req.body.categoryId)
  let categoryName = category.name
  let castomCost = req.body.castomizeCategoryCost
  let payers = req.body.payer
  let fullCost = category.cost
  let newTrip = await Trip.findOne({ name: category.trip })
  let castomCostArr = []

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
        category.name = categoryName,
        category.cost = fullCost,
        category.users = castomCostArr
    try {

      await category.save()
      res.render('SavedCastomizeCategory', {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        userName: req.session?.user?.name
      })
      
    } catch (e) {
      console.log(e)

      res.render('SavedCastomizeCategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name 
      })
    }
  } else {
    res.render('SavedCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
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
