const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const User = require('../models/user-model')
const { getId, getChartSourceLink, getHtml, docType } = require('../utils/index')
const Summary = require('../views/Summary')
const AllTrips = require('../views/AllTrips')
const EditCategory = require('../views/EditCategory')
const Equally = require('../views/Equally')
const Createcategory = require('../views/Createcategory')
const NewTrip = require('../views/NewTrip')
const CastomizeCategory = require('../views/CastomizeCategory')
const EditCastomizeCategory = require('../views/EditCastomizeCategory')
const SavedCastomizeCategory = require('../views/SavedCastomizeCategory')

const allTrips = async (req, res) => {
  try {
    const { user } = req.session
    const allTrips = await Trip.find({ email: user?.email})

    res.renderComponent(AllTrips, { 
      allTrips, 
      username: user?.name 
    })  
  } catch (e) {
    console.log(e)
  }
}

const findCategoryById = async (req, res) => {
  try {
    const { tripName } = req.body
    const { id } = req.params
    const { user } = req.session

    const newTrip = await Trip.findOne({name: tripName})
    const category = await Category.findById(id)
    const categoryName = category.name

    res.renderComponent(EditCategory, {
      newTrip, 
      categoryName, 
      category,
      username: user?.name,
      error: ''
    })
  } catch (e) {
    console.log(e)
  }
}

const editCategoryEqually = async (req, res) => {
  try {
    const { tripName, name, cost } = req.body
    const { id } = req.params
    let { users } = req.body
    const { user } = req.session

    const newTrip = await Trip.findOne({ name: tripName })
    let category = await Category.findById(id)
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

      res.renderComponent(Equally, {
        categoryName, 
        payers, 
        payerCost, 
        newCategory, 
        newTrip,
        username: user?.name
      })
  } else {
    res.renderComponent(Createcategory, {
      error: 'Not all fields are filled!',
      username: user?.name
    })
    }
    } catch (e) {
        console.log(e)

        res.renderComponent(Createcategory, {
          error: 'Incorrect data!',
          username: req.session?.user?.name 
        })
      }
}

  const findTripById = async (req, res) => {
  try {
    const { id } = req.params
    const { user } = req.session

    const trip = await Trip.findById(id)
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
  
    res.renderComponent(Summary, {
      username: user?.name,
      trip, 
      allCategories, 
      resultNames, 
      resulCostArr, 
      maxSumObj, 
      chartSourceLink: getChartSourceLink(result, resultCost, sum)
    })
  } catch (e) {
    console.log(e.message)
  }
}

const renderNewtrip = async (req, res) => {
  try {
    res.renderComponent(NewTrip)
  } catch (e) {
    console.log(e)
  }
}

const createNewTrip = async (req, res) => {
  try {
    const { newTripName, tripUsers } = req.body

    const tripName = newTripName
    const tripUsersResult = tripUsers.split(',')
    let user = await User.findOne({ email: req.session.user.email })
    let newTrip
    const trips = []
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

      res.renderComponent(Createcategory, {
        tripName, 
        tripUsersResult, 
        newTrip,
        username: req.session?.user?.name 
      })
  } else {
    res.renderComponent(NewTrip, {
      error: 'All fields must be filled', 
      tripName, 
      tripUsersResult, 
      newTrip,
      username: req.session?.user?.name  
    })
  }
  } catch (e) {
    console.log(e)
  } 
}

const renderCreateCategory = (req, res) => {
  try {
    const { tripName } = req.body
    const { user } = req.session

    res.renderComponent(Createcategory, {
      tripName,
      username: user?.name,
      error: ''
    })
  } catch (e) {
    console.log(e.message)
  }
}

const addCategory = async (req, res) => {
  try {
    const { tripName } = req.body
    const { user } = req.session

    const newTrip = await Trip.findOne({ name: tripName })

    res.renderComponent(Createcategory, {
      newTrip,
      username: user?.name,
      error: '' 
    })
  } catch (e) {
    console.log(e)
  }
}

const createNewCategory = async (req, res) => {
  try {
    const { newCategoryName, fullCost, tripId } = req.body
    const { user } = req.session

    const categoryName = newCategoryName
    const cost = fullCost
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

      res.renderComponent(Equally, {
        categoryName, 
        payers, 
        payerCost, 
        tripName, 
        newCategory, 
        newTrip,
        username: user?.name,
        error: '' 
      })
  } else {
      res.renderComponent(Createcategory, {
        error: 'All fields must be filled', 
        categoryName, 
        payers, 
        payerCost, 
        tripName, 
        newCategory, 
        newTrip,
        username: user?.name
      })
    }
  } catch (e) {
    console.log(e)
  }  
}

const renderCastomizeCategory = async (req, res) => {
  try {
    const { newCategoryName, tripName, fullCost, payers } = req.body
    const { user } = req.session

    const categoryName = newCategoryName
    const newTrip = await Trip.findOne({ name: tripName })

    res.renderComponent(CastomizeCategory, {
      newTrip, 
      categoryName, 
      fullCost, 
      payers,
      username: user?.name 
    })
  } catch(e) {
    console.log(e)
  }
}

const castomizeCategory = async (req, res) => {
  try {
    const { newCategoryName, fullCost, payers, tripName } = req.body
    const { user } = req.session

    const categoryName = newCategoryName
    const newTrip = await Trip.findOne({ name: tripName })

  if (categoryName && fullCost && payers) {
      res.renderComponent(CastomizeCategory, {
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        username: user?.name 
      })
  } else {
      res.renderComponent(CastomizeCategory, {
        error: 'All fields must be filled',
        username: user?.name
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(CastomizeCategory, {
      error: 'Incorrect data!',
      username: req.session?.user?.name 
    })
  }  
}

const editCategoryCastomize = async (req, res) => {
  try {
    const { categoryId } = req.body
    const { user } = req.session

    const category = await Category.findById(categoryId)
    const newTrip = await Trip.findOne({name: category.trip})
    const categoryName = category.name
    const fullCost = category.cost
    const payersObject = category.users
    const payers = payersObject.map((el) => {
      return el.name
    })

  if (categoryName && fullCost && payers) {
      res.renderComponent(EditCastomizeCategory, {
        category, 
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        username: user?.name 
      })
  } else {
      res.renderComponent(EditCastomizeCategory, {
        error: 'Not all fields are filled!',
        username: user?.name
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(EditCastomizeCategory, {
      error: 'Incorrect data!',
      username: req.session?.user?.name 
    })
  }  
}

const renderSavedCastomizeCategory = async (req, res) => {
  try {
    const { categoryName, castomizeCategoryCost, payer, tripName } = req.body
    const { user } = req.session

    const castomCost = castomizeCategoryCost
    const payers = payer
    const newTrip = await Trip.findOne({name: tripName})

    res.renderComponent(SavedCastomizeCategory, {
      categoryName, 
      castomCost, 
      payers, 
      newTrip,
      username: user?.name
    })
  } catch (e) {
    console.log(e.message)
  }
}

const saveCastomizeCategory = async (req, res) => {
  try {
    const { categoryName, castomizeCategoryCost, payer, fullCost, tripName } = req.body
    const { user } = req.session

    const castomCost = castomizeCategoryCost
    const payers = payer
    const newTrip = await Trip.findOne({ name: tripName })
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
      
      res.renderComponent(SavedCastomizeCategory, {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        username: user?.name
      })
  } else {
      res.renderComponent(SavedCastomizeCategory, {
        error: 'All fields must be filled',
        username: user?.name
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(SavedCastomizeCategory, {
      error: 'Incorrect data!',
      username: req.session?.user?.name 
    })
  }  
}

const saveEditCastom = async (req, res) => {
  try {
    const { payer, castomizeCategoryCost, categoryId } = req.body
    const { user } = req.session

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

      res.renderComponent(SavedCastomizeCategory, {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        username: user?.name
      })
  } else {
      res.renderComponent(SavedCastomizeCategory, {
        error: 'All fields must be filled',
        username: user?.name
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(SavedCastomizeCategory, {
      error: 'Incorrect data!',
      username: req.session?.user?.name 
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
  allTrips,
  findTripById,
  addCategory,
  findCategoryById,
  editCategoryEqually,
  editCategoryCastomize,
  saveEditCastom
}
