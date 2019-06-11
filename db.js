class Db {

  constructor() {
    this.projects = [];
  }

  add(id, data) {
    const existId = this.projects.findIndex(i => i.id ===id);

    if (existId === -1) {
      this.projects.push({
        id: id,
        ...data,
      });
    }
  }

  getData() {
    return this.projects;
  }

  debug() {
    console.log('Projects saved:');
    console.log(this.projects);
  }

}

module.exports = Db;
