class ApiFeature {
  constructor(query, { sort, page = 1, limit = 100, fields, ...queryObj }) {
    this.query = query;
    this.sort = sort;
    this.page = page;
    this.limit = limit;
    this.fields = fields;
    this.queryObj = queryObj;
  }

  filter() {
    let queryStr = JSON.stringify(this.queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, match => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sortQ() {
    const sortStr = this.sort ? this.sort.split(',').join(' ') : '-createdAt';
    this.query.sort(sortStr);
    return this;
  }

  select() {
    const fieldsStr = this.fields ? this.fields.split(',').join(' ') : '-__v';
    this.query.select(fieldsStr);
    return this;
  }

  paginate() {
    const skip = (this.page - 1) * this.limit;
    this.query.skip(skip).limit(+this.limit);
    return this;
  }
}

module.exports = ApiFeature;
