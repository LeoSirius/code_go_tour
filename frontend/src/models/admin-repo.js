class AdminRepo {
  constructor(repo) {
    let obj = new Object();
    obj.key = repo.id;
    obj.name = repo.name;
    obj.url = repo.url;
    return obj;
  }
}
export default AdminRepo;