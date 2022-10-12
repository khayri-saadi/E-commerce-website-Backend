class APIfeatures {
    constructor(query,queryString) {
        this.query = query,
        this.queryString = queryString
    }
    search() {
        const keyword = this.queryString.keyword ? {
            name : {
                $regex: this.queryString.keyword,
                $options: 'i'
            } 
        } : {}
        //console.log(keyword)
        this.query = this.query.find({...keyword})
        return this;
    }
    filter() {
        const queryObj = { ...this.queryString }
        
        const RemoveFields = ['page','keyword','limit']
        RemoveFields.forEach( el =>  delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query =  this.query.find(JSON.parse(queryStr))
        console.log(queryStr)
        return this

    }
    paginate(resPerpage) {
        const page = this.queryString.page * 1 || 1;
        const skip = (page -1) * resPerpage
         this.query = this.query.limit(resPerpage).skip(skip)
         return this;
         
    }
}
module.exports = APIfeatures;
