const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const User = require('../models/user-model')
const { getId, getChartSourceLink, getUserTrips } = require('../utils/index')
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
    const { username } = res.locals
    const { user } = req.session

    const allTrips = await Trip.find({ email: user?.email})

    res.renderComponent(AllTrips, { 
      allTrips, 
      username
    })  
  } catch (e) {
    console.log(e)
  }
}

const findCategoryById = async (req, res) => {
  try {
    const { tripName } = req.body
    const { id } = req.params
    const { username } = res.locals

    const newTrip = await Trip.findOne({name: tripName})
    const category = await Category.findById(id)
    const categoryName = category.name

    res.renderComponent(EditCategory, {
      newTrip, 
      categoryName, 
      category,
      username,
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
    const { username } = res.locals

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
        username
      })
  } else {
    res.renderComponent(Createcategory, {
      error: 'All fields must be filled',
      username
    })
    }
    } catch (e) {
        console.log(e.message)

        res.renderComponent(Createcategory, {
          error: e.message || 'Something went wrong',
          username: res.locals.username
        })
      }
}

  const findTripById = async (req, res) => {
  try {
    const { id } = req.params
    const { username } = res.locals

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
      username,
      trip, 
      allCategories, 
      resultNames, 
      resulCostArr, 
      maxSumObj, 
      chartSourceLink: getChartSourceLink(result, resultCost, sum)
    })
  } catch (e) {
    console.log(e.message)

    res.renderComponent(Summary, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }
}

const renderNewtrip = async (req, res) => {
  try {
    res.renderComponent(NewTrip)
  } catch (e) {
    console.log(e)

    res.renderComponent(NewTrip, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }
}

const createNewTrip = async (req, res) => {
  try {
    const { newTripName, tripUsers } = req.body
    const { username } = res.locals
    const { email } = req.session.user
    const userTripNames = await getUserTrips(email)
    let newTrip

    if (userTripNames.includes(newTripName)) {
      throw new Error(`${username}, you already have ${newTripName} trip please specify the new trip name!`)
    } else {
        const tripName = newTripName
        const tripUsersResult = tripUsers.split(',')
        let user = await User.findOne({ email: req.session.user.email })
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
          newTrip: {
            name: tripName,
            users: tripUsersResult,
            email: req.session.user.email
          },
          username: req.session?.user?.name  
        })
      }
    }
  } catch (e) {
    console.log(e.message)

    res.renderComponent(NewTrip, {
      error: e.message || 'Something went wrong',
      username: res.locals.username,
      tripName: req.body.newTripName, 
      tripUsersResult: [], 
      newTrip: {
        name: req.body.newTripName,
        users: req.body.tripUsers,
        email: req.session.user.email
      },
    })
  } 
}

const renderCreateCategory = (req, res) => {
  try {
    const { tripName } = req.body
    const { username } = res.locals

    res.renderComponent(Createcategory, {
      tripName,
      username,
      error: ''
    })
  } catch (e) {
    console.log(e.message)

    res.renderComponent(Createcategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username,
      tripName: req.body.tripName
    })
  }
}

const addCategory = async (req, res) => {
  try {
    const { tripName } = req.body
    const { username } = res.locals

    const newTrip = await Trip.findOne({ name: tripName })

    res.renderComponent(Createcategory, {
      newTrip,
      username,
      error: '' 
    })
  } catch (e) {
    console.log(e)

    res.renderComponent(Createcategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username,
      newTrip: {
        name: req.body.tripName,
        users: []
      }
    })
  }
}

const createNewCategory = async (req, res) => {
  try {
    const { newCategoryName, fullCost, tripId } = req.body
    const { username } = res.locals
    const { email } = req.session.user

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
    const existCategory = tripCategories.find((category) => category.name === categoryName)

    if (existCategory) {
      const updateTripCategoryUsers = existCategory.users.map((user) => user.cost += payerCost)

      const updateCategories = tripCategories.map((category) => {
        if (category.name === categoryName) {
          category.cost += cost
          category.users = updateTripCategoryUsers
        }
        return category
      })
      newTrip.categories = updateCategories
      newTrip.save()

      const userCategory = await Category.find({ email, name: categoryName })
      if (userCategory) {
        userCategory.cost += cost
        userCategory.users = updateTripCategoryUsers
        userCategory.save
      }

    } else {
      newCategory = new Category({
        name: categoryName,
        cost,
        users: payerCostArr,
        trip: tripName,
        email
      })
      newTrip.categories = [...newTrip.categories, newCategory]
      await newTrip.save()
      await newCategory.save()
    }

      res.renderComponent(Equally, {
        categoryName, 
        payers, 
        payerCost, 
        tripName, 
        newCategory, 
        newTrip,
        username,
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
        username
      })
    }
  } catch (e) {
    console.log(e.message)

    res.renderComponent(Createcategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username,
      newTrip: {
        name: req.body.tripName,
        users: []
      }
    })
  }  
}

const renderCastomizeCategory = async (req, res) => {
  try {
    const { newCategoryName, tripName, fullCost, payers } = req.body
    const { username } = res.locals

    const categoryName = newCategoryName
    const newTrip = await Trip.findOne({ name: tripName })

    res.renderComponent(CastomizeCategory, {
      newTrip, 
      categoryName, 
      fullCost, 
      payers,
      username
    })
  } catch(e) {
    console.log(e)

    res.renderComponent(CastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }
}

const castomizeCategory = async (req, res) => {
  try {
    const { newCategoryName, fullCost, payers, tripName } = req.body
    const { username } = res.locals

    const categoryName = newCategoryName
    const newTrip = await Trip.findOne({ name: tripName })

  if (categoryName && fullCost && payers) {
      res.renderComponent(CastomizeCategory, {
        categoryName, 
        payers, 
        fullCost, 
        newTrip,
        username
      })
  } else {
      res.renderComponent(CastomizeCategory, {
        error: 'All fields must be filled',
        username
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(CastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }  
}

const editCategoryCastomize = async (req, res) => {
  try {
    const { categoryId } = req.body
    const { username } = res.locals

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
        username
      })
  } else {
      res.renderComponent(EditCastomizeCategory, {
        error: 'Not all fields are filled!',
        username
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(EditCastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }  
}

const renderSavedCastomizeCategory = async (req, res) => {
  try {
    const { categoryName, castomizeCategoryCost, payer, tripName } = req.body
    const { username } = res.locals

    const castomCost = castomizeCategoryCost
    const payers = payer
    const newTrip = await Trip.findOne({name: tripName})

    res.renderComponent(SavedCastomizeCategory, {
      categoryName, 
      castomCost, 
      payers, 
      newTrip,
      username
    })
  } catch (e) {
    console.log(e.message)

    res.renderComponent(SavedCastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }
}

const saveCastomizeCategory = async (req, res) => {
  try {
    const { categoryName, castomizeCategoryCost, payer, fullCost, tripName } = req.body
    const { username } = res.locals
    const { email } = req.session.user

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
        trip: newTrip.name,
        email
      })

      await newCategory.save()
      
      res.renderComponent(SavedCastomizeCategory, {
        categoryName, 
        castomCostArr, 
        payers, 
        newTrip,
        username
      })
  } else {
      res.renderComponent(SavedCastomizeCategory, {
        error: 'All fields must be filled',
        username
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(SavedCastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
    })
  }  
}

const saveEditCastom = async (req, res) => {
  try {
    const { payer, castomizeCategoryCost, categoryId } = req.body
    const { username } = res.locals

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
        username
      })
  } else {
      res.renderComponent(SavedCastomizeCategory, {
        error: 'All fields must be filled',
        username
      })
    }
  } catch (e) {
    console.log(e)

    res.renderComponent(SavedCastomizeCategory, {
      error: e.message || 'Something went wrong',
      username: res.locals.username
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
