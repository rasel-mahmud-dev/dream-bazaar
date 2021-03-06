import { ACTION_TYPES } from "store/types"
import apis from "src/apis";


export const fetchProducts = () => async (dispatch, getState, api) => {
  const { data } = await api.get("/api/products") 
  console.log(data)
}

export const fetchProduct = (id) => async (dispatch, getState, api) => {
  handlerLoader(dispatch, {isLoading: true, where: "product_details"})
  const { data } = await api.get(`/api/products/${id}`) 
  dispatch({
    type: ACTION_TYPES.FETCH_PRODUCT,
    payload: data.product
  })
}

export const fetchBrandForCategory=(current_category_id)=> async (dispatch, getState, api)=>{
  let data = await api.get("/api/brands", )
  
}

// fetch homepage section product...
export const fetchHomePageSectionProducts = () => async (dispatch, getState, api) => {
   handlerLoader(dispatch, {isLoading: true, where: "home_section"})
   let { homePageSectionsData, paginations, loadingStates } = getState().productState
  
  // let loadingState = loadingStates.find(ls=>ls.where === "home_section")
    
    
    let h = {}
    let pagination = paginations && paginations.find(pg=>pg.where === "home_section")
    const paginatedHomePageSectionsData = homePageSectionsData.slice(pagination.perPage * (pagination.currentPage - 1), (pagination.perPage * pagination.currentPage) )
  
  
    paginatedHomePageSectionsData.forEach( (data, i)=>{
      (async function(){
        try {
          
          // await api.get(`/api/products/fetch-home-page/?type=${item.filterBy}&pageNumber=${currentPage}&perPage=${perPage}`)
          if(data.params){
            let response = await apis.get(`/api/products/filter/v2?${data.params}`)
            
            h[data.name] = { values: response.data, type: data.type }
            
            if(paginatedHomePageSectionsData.length === (i + 1)){
              dispatch({
                type: ACTION_TYPES.FETCH_HOMEPAGE_SECTION_PRODUCTS,
                payload: h
              })
              handlerLoader(dispatch, {isLoading: false, where: "home_section"})
            }
          }
       
        } catch (ex){
          console.log(ex.message)
        }
        
      })()
    })
  
  
  // console.log(h)
  
  // let id = setTimeout(() => {
  //   dispatch({
  //     type: ACTION_TYPES.FETCH_HOMEPAGE_SECTION_PRODUCTS,
  //     payload: h
  //   })
  //   handlerLoader(dispatch, {isLoading: false, where: "home_section"})
  //
  // }, 100)
}


// get length of one-type-products
export const fetchOneTypeProductLength = (homePageSectionData: {type: string, params: string})=> async (dispatch, getState, api)=>{
  
  let count = 0
  
  switch(homePageSectionData.type){
    case "products":
      let pData = await api.get(`/api/products/fetch-home-page-count?type=${homePageSectionData.type}&${homePageSectionData.params}`)
      console.log(pData)
      count = pData.data.count
      break
    
    default :
      return
  }
  
  dispatch({
    type: ACTION_TYPES.ONE_TYPE_PRODUCTS_LENGTH,
    payload: count
  })
}

export const fetchOneTypeProduct = (homePageSectionData, currentPage=1, perPage)=> async (dispatch, getState, api)=>{
  const prod = await fetchOneTypeProductsFromDb(homePageSectionData, api, currentPage, perPage)
  dispatch({
    type: ACTION_TYPES.ONE_TYPE_PRODUCTS_FETCH,
    payload: {name: homePageSectionData.name, values: prod, type: homePageSectionData.type}
  })
}

function fetchOneTypeProductsFromDb(homePageSectionData, api, currentPage=1, perPage=10){
  return new Promise(async(resolve, reject)=>{
    
    let response;
    let arrOfProducts = []
    let pData;
    
    switch(homePageSectionData.type){
      case "products":
        pData = await api.get(`/api/products/filter/?type=${homePageSectionData.type}&${homePageSectionData.params}&pageNumber=${currentPage}&perPage=${perPage}`)
        arrOfProducts = pData.data && pData.data
        // break

      // case "top-selling" :
      //   pData = await api.get(`/api/products/fetch-home-page/?type=${item.filterBy}&pageNumber=${currentPage}&perPage=${perPage}`)
      //   arrOfProducts = pData.data.products && pData.data.products
      //   break
      //
      // case "top-views" :
      //   pData = await api.get(`/api/products/fetch-home-page/?type=${item.filterBy}&pageNumber=${currentPage}&perPage=${perPage}`)
      //   // console.log(pData)
      //   arrOfProducts = pData.data.products && pData.data.products
      //   break
      //
      // case "fetch-categories" :
      //   pData = await api.post(`/api/categories/?pageNumber=${currentPage}&perPage=${perPage}`, { ids: item.ids ? item.ids : [] })
      //   arrOfProducts = pData.data.categories && pData.data.categories
      //   break
      //
      // case "fetch-brands" :
      //   pData = await api.post(`/api/brands/?&pageNumber=${currentPage}&perPage=${perPage}`, { ids: item.ids ? item.ids : [] })
      //   arrOfProducts = pData.data.brands && pData.data.brands
      //   break
    }

    // console.log(item.name, arrOfProducts)
    resolve(arrOfProducts)
  })
}



export const toggleLoader = (where, isLoading)=> async (dispatch)=>{
  dispatch({
    type: ACTION_TYPES.LOADER_CIRCLE,
    payload: {isLoading, where}
  })
}

function handlerLoader(dispatch, state){
  dispatch({
    type: ACTION_TYPES.LOADER_CIRCLE,
    payload: state
  })
}


type changePaginationType = {
  where: string, 
  currentPage: number,
  type: ("increment" | "decrement")
}

export const changePagination = (payload: changePaginationType) => {   
  return {
    type: ACTION_TYPES.CHANGE_PAGINATION,
    payload: payload
  }
  
}
