class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    };
    filter(){
      //  BUILD QUERY FOR FILTERING
      let queryObj={...this.queryString}
      let excludedFields=["sort","page","limit","fields"]
      excludedFields.forEach(el=> delete queryObj[el]) // remove excluded fields from query     object so than we can chain these as they are provided , not all at one go
      // Advanced filtering
      let queryStr=JSON.stringify(queryObj)
      queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
      this.query.find(JSON.parse(queryStr))
      return this;
       };
    
    sort() {
        //2 SORTING
        if (this.queryString.sort) {
          const sortBY = this.queryString.sort.split(',').join(' ');
          // console.log(sortBY);
          this.query = this.query.sort(sortBY); // sorts in ascending order
          //sort{'price ratingsAverage'}
        } else {
          this.query = this.query.sort('-createdAt'); //default value
        }
    
        return this;
      };

    limitFields() {
        // LIMITING
        if (this.queryString.fields) {
          const fields = this.queryString.fields.split(',').join(' ');
          this.query = this.query.select(fields);
        } else {
          this.query = this.query.select('-__v'); // excluding
        }
    
        return this;
      };

      paginate() {
        //4 PAGINATION
        const page = this.queryString.page * 1 || 1; // getting page
        const limit = this.queryString.limit * 1 || 100; // default limit 100
        const skip = (page - 1) * limit;
        // page1=1-10,page2= 11-20, page3= 21-30
        this.query = this.query.skip(skip).limit(limit);
        return this;
      };

    

}
module.exports={APIFeatures}