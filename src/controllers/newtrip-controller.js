const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const User = require('../models/user-model')
const { getId, getChartSourceLink, getHtml, docType } = require('../utils/index')
const Summary = require('../views/Summary')

const renderTripReport = async (req, res) => {
  try {
    res.render('Summary')
  } catch (e) {
    console.log(e.message)
  }
}

const allTrips = async (req, res) => {
  try {
    const allTrips = await Trip.find({ email: req.session?.user?.email})
    res.render('AllTrips', { 
      allTrips, 
      userName: req.session?.user?.name 
    })  
  } catch (e) {
    console.log(e)
  }
}

const findCategoryById = async (req, res) => {
  try {
    const newTrip = await Trip.findOne({name: req.body.tripName})
    const category = await Category.findById(req.params.id)
    const categoryName = category.name

    res.render('EditCategory', {
      newTrip, 
      categoryName, 
      category,
      userName: req.session?.user?.name,
      error: ''
    })
  } catch (e) {
    console.log(e)
  }
}

const editCategoryEqually = async (req, res) => {
  try {

  const newTrip = await Trip.findOne({ name: req.body.tripName })
  let category = await Category.findById(req.params.id)
  let { name, cost, users } = req.body
  category.name = name 
  category.cost = cost
  
  const userString = users.join()
  const newUsers = userString.split(',')
  users = newUsers

  const payerCost = Math.round(cost / users.length)
  const payerCostArr = []
  for (let i = 0; i < users.length; i++) {
    payerCostArr.push({ name: users[i], cost: payerCost })
  }

  if (name && cost && users) {
      category.users = payerCostArr
      const categoryName = name
      const payers = users
      const newCategory = category
      await category.save()

      res.render('Equally', { 
        categoryName, 
        payers, 
        payerCost, 
        newCategory, 
        newTrip,
        userName: req.session?.user?.name 
      })
  } else {
    res.render('Createcategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name 
    })
    }
    } catch (e) {
        console.log(e)
        res.render('Createcategory', { 
        error: 'Incorrect data!',
        userName: req.session?.user?.name  
        })
      }
}

  const findTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    const allCategories = await Category.find({ trip: trip.name })
  
    const users = []
    for (let i = 0; i < allCategories.length; i++) {
      users.push(allCategories[i].users)
    }
  
    const names = []
    const usersArr = users.flat()
  
    for (let i = 0; i < usersArr.length; i++) {
      names.push(usersArr[i].name)
    }
    
    const resultNames = [...new Set(names)]
    let userSpent = 0
    const resulCostArr = []
  
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
    const resultCost = []
    for (let i = 0; i < resulCostArr.length - 1; i++) {
      resultCost[i] = resulCostArr[i].cost
      sum += resulCostArr[i].cost
    }
  
    res.write(docType)
    res.end(getHtml(Summary, {
      userName: req.session?.user?.name,
      trip, 
      allCategories, 
      resultNames, 
      resulCostArr, 
      maxSumObj, 
      chartSourceLink: getChartSourceLink(result, resultCost, sum)
    }))
  } catch (e) {
    console.log(e.message)
  }
}

const renderNewtrip = async (req, res) => {
  try {
    res.render('NewTrip')
  } catch (e) {
    console.log(e)
  }
}

const createNewTrip = async (req, res) => {
  try {
  let tripName = req.body.newTripName
  let tripUsers = req.body.tripUsers
  let tripUsersResult = tripUsers.split(',')
  let user = await User.findOne({ email: req.session.user.email })
  let newTrip
  let trips = []
  trips.push(tripName)
  user.trips = [...user.trips, ...trips]

  if (tripName && tripUsers) {
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
  } else {
    res.render('NewTrip', { 
      error: 'Not all fields are filled!', 
      tripName, 
      tripUsersResult, 
      newTrip,
      userName: req.session?.user?.name  
    })
  }
  } catch (e) {
    console.log(e)
  } 
}

const renderCreateCategory = (req, res) => {
  try {
    const { tripName } = req.body

    res.render('Createcategory', { 
      tripName,
      userName: req.session?.user?.name,
      error: '' 
    })
  } catch (e) {
    console.log(e.message)
  }
}

const addCategory = async (req, res) => {
  try {
    const { tripName } = req.body
    const newTrip = await Trip.findOne({ name: tripName })

    res.render('Createcategory', { 
      newTrip,
      userName: req.session?.user?.name,
      error: ''  
    })
  } catch (e) {
    console.log(e)
  }
}

const createNewCategory = async (req, res) => {
  try {

  const categoryName = req.body.newCategoryName
  const cost = req.body.fullCost
  const tripId = req.body.tripId
  let newTrip = await Trip.findById(tripId)
  const payers = newTrip.users
  const tripCategories = newTrip.categories
  let newCategory
  const tripName = newTrip.name
  const payerCost = Math.round(cost / payers.length)
  const payerCostArr = []

  for (let i = 0; i < payers.length; i++) {
    payerCostArr.push({ name: payers[i], cost: payerCost })
  }

  if (categoryName && cost && payers) {
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
  } catch (e) {
    console.log(e)
  }  
}

const renderCastomizeCategory = async (req, res) => {
  try {
    const categoryName = req.body.newCategoryName
    const newTrip = await Trip.findOne({ name: req.body.tripName })
    const fullCost = req.body.fullCost
    const payers = req.body.payers

    res.render('CastomizeCategory', { 
      newTrip, 
      categoryName, 
      fullCost, 
      payers,
      userName: req.session?.user?.name 
    })
  } catch(e) {
    console.log(e)
  }
}

const castomizeCategory = async (req, res) => {
  try {

  const categoryName = req.body.newCategoryName
  const fullCost = req.body.fullCost
  const payers = req.body.payers
  const newTrip = await Trip.findOne({ name: req.body.tripName })

  if (categoryName && fullCost && payers) {
      res.render('CastomizeCategory', { 
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        userName: req.session?.user?.name 
      })
  } else {
    res.render('CastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
    }
  } catch (e) {
    console.log(e)

    res.render('CastomizeCategory', { 
      error: 'Incorrect data!',
      userName: req.session?.user?.name  
    })
  }  
}

const editCategoryCastomize = async (req, res) => {
  try {

  const category = await Category.findById(req.body.categoryId)
  const newTrip = await Trip.findOne({name: category.trip})
  const categoryName = category.name
  const fullCost = category.cost
  const payersObject = category.users
  const payers = payersObject.map((el) => {
    return el.name
  })

  if (categoryName && fullCost && payers) {
      res.render('EditCastomizeCategory', { 
        category, 
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        userName: req.session?.user?.name 
      })
  } else {
    res.render('EditCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
    }
  } catch (e) {
    console.log(e)

    res.render('EditCastomizeCategory', { 
      error: 'Incorrect data!',
      userName: req.session?.user?.name 
    })
  }  
}

const renderSavedCastomizeCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName
    const castomCost = req.body.castomizeCategoryCost
    const payers = req.body.payer
    const newTrip = await Trip.findOne({name: req.body.tripName})

    res.render('SavedCastomizeCategory', {
      categoryName, 
      castomCost, 
      payers, 
      newTrip,
      userName: req.session?.user?.name
    })
  } catch (e) {
    console.log(e.message)
  }
}

const saveCastomizeCategory = async (req, res) => {
  try {
  const { categoryName, castomizeCategoryCost, payer, fullCost } = req.body
  const castomCost = castomizeCategoryCost
  const payers = payer
  const newTrip = await Trip.findOne({ name: req.body.tripName })
  const castomCostArr = []

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
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
  } else {
    res.render('SavedCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
    }
  } catch (e) {
    console.log(e)

    res.render('SavedCastomizeCategory', { 
      error: 'Incorrect data!',
      userName: req.session?.user?.name 
    })
  }  
}

const saveEditCastom = async (req, res) => {
  try {
  const { payer, castomizeCategoryCost, categoryId } = req.body

  let category = await Category.findById(categoryId)
  const categoryName = category.name
  const castomCost = castomizeCategoryCost
  const payers = payer
  const fullCost = category.cost
  const newTrip = await Trip.findOne({ name: category.trip })
  const castomCostArr = []

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
        category.name = categoryName,
        category.cost = fullCost,
        category.users = castomCostArr

      await category.save()
      res.render('SavedCastomizeCategory', {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        userName: req.session?.user?.name
      })
  } else {
    res.render('SavedCastomizeCategory', {
      error: 'Not all fields are filled!',
      userName: req.session?.user?.name
    })
    }
  } catch (e) {
    console.log(e)

    res.render('SavedCastomizeCategory', { 
      error: 'Incorrect data!',
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
