// Imports
const path = require('path')
const url = require('url')
const sqlite3 = require('sqlite3');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: './salescontrol.db'
  },
  useNullAsDefault: true
});

// Deconstruct imports
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// Variables for windows
let mainWindow
let editClientWindow
let addClientWindow
let editProductWindow
let addProductWindow
let addSaleWindow
let editSaleWindow

// Create 'mainWindow'
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    icon: __dirname + '/images/logo.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  //mainWindow.webContents.openDevTools()

  createEditClientWindow();
  createEditProductWindow();
  createEditSaleWindow()

  mainWindow.loadFile('mainwindow.html')

  mainWindow.on('closed', function() {
    //app.quit();
    mainWindow = null
  });

  // ADD CLIENT
  ipcMain.on('client:add', function(e, obj) {   // delete show:false !!!!
    createAddClientWindow();
  });
  ipcMain.on('client:insertData', function(e, obj) {
    addClientToDb(obj)
    addClientWindow.close();
    readClientsFromDB();
  });

  // DELETE CLIENT
  ipcMain.on('client:deletebyId', function(e, id){
    deleteClientFromDb(id);
    readClientsFromDB();
 })

  // EDIT CLIENT
  ipcMain.on('client:editbyId', function(e, id) {
    knex.select().from("clients").where("id", id)
    .then(function(rows){
      editClientWindow.webContents.send('client: initial',rows);   // send row for update from db to editClientWindow
      editClientWindow.show();
    })
    .catch((err) => { console.log( err); throw err })
  });
  ipcMain.on('client:update', function(e, obj){       // receive object for updating from updateWindow
    updateClientFromDb(obj)
    editClientWindow.close();
    readClientsFromDB();
  });


  // ADD PRODUCT
  ipcMain.on('product:add', function(e, obj) {
    createAddProductWindow();
  });
  ipcMain.on('product:insertData', function(e, obj) {
    addProductToDb(obj)
    addProductWindow.close();
    readProductsFromDB();
  });

  // DELETE PRODUCT
  ipcMain.on('product:deletebyId', function(e, id){
    deleteProductFromDb(id);
    readProductsFromDB();
  })

  // EDIT PRODUCT
  ipcMain.on('product:editbyId', function(e, id) {
    knex.select().from("products").where("id", id)
    .then(function(rows){
      editProductWindow.webContents.send('product: initial',rows);   // send row for update from db to editProductWindow
      editProductWindow.show();
    })
    .catch((err) => { console.log( err); throw err })
  });
  ipcMain.on('product:update', function(e, obj){       // receive object for updating from editProductWindow
    updateProductFromDb(obj)
    editProductWindow.close();
    readProductsFromDB();
  });


  // ADD SALE
  ipcMain.on('sale:add', function(e, obj) {
    createAddSaleWindow();
  });
  ipcMain.on('sale:insertData', function(e, obj) {
    addSaleToDb(obj)
    addSaleWindow.close();
    readSalesFromDB();
  });

  // DELETE SALE
  ipcMain.on('sale:deletebyId', function(e, id){
    deleteSaleFromDb(id);
    readSalesFromDB();
  })

  // EDIT SALE
  ipcMain.on('sale:editbyId', function(e, id) {
    knex.select().from("sales").where("id", id)
    .then(function(rows){
      editSaleWindow.webContents.send('sale: initial',rows);   // send row for update from db to editSaleWindow
      editSaleWindow.show();
    })
    .catch((err) => { console.log( err); throw err })
  });
  ipcMain.on('sale:update', function(e, obj){       // receive object for updating from editSaleWindow
    updateSaleFromDb(obj)
    editSaleWindow.close();
    readSalesFromDB();
  });
}


/*=============  WINDOWS  ============================*/
// Create 'addClientWindow' 
function createAddClientWindow() {
  addClientWindow = new BrowserWindow({
    width: 350,
    height: 240,
    frame: false,        
    webPreferences: {
      nodeIntegration: true
    }
  });

  addClientWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'add_client_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //addClientWindow.webContents.openDevTools()
}

// Create 'editClientWindow' 
function createEditClientWindow() {
  editClientWindow = new BrowserWindow({
    width: 350,
    height: 240,
    show: false,    // !!!!
    frame: false, 
    webPreferences: {
      nodeIntegration: true
    }
  });

  editClientWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'edit_client_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //editClientWindow.webContents.openDevTools()

  editClientWindow.on('close', function(e) {
    editClientWindow.hide();
    e.preventDefault();
  });
}

// Create 'addProductWindow' 
function createAddProductWindow() {
  addProductWindow = new BrowserWindow({
    width: 350,
    height: 284,
    frame: false, 
    webPreferences: {
      nodeIntegration: true
    }
  });

  addProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'add_product_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //addProductWindow.webContents.openDevTools()
}

// Create 'editProductWindow' 
function createEditProductWindow() {
  editProductWindow = new BrowserWindow({
    width: 350,
    height: 284,
    show: false,
    frame: false,    
    webPreferences: {
      nodeIntegration: true
    }
  });

  editProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'edit_product_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //editProductWindow.webContents.openDevTools()

  editProductWindow.on('close', function(e) {
    editProductWindow.hide();
    e.preventDefault();
  });
}

// Create 'addSaleWindow' 
function createAddSaleWindow() {
  addSaleWindow = new BrowserWindow({
    width: 350,
    height: 284,
    frame: false, 
    webPreferences: {
      nodeIntegration: true
    }
  });

  addSaleWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'add_sale_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //addSaleWindow.webContents.openDevTools()
}

// Create 'editSaleWindow' 
function createEditSaleWindow() {
  editSaleWindow = new BrowserWindow({
    width: 350,
    height: 168,
    show: false, 
    frame: false,  
    webPreferences: {
      nodeIntegration: true
    }
  });

  editSaleWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'edit_sale_window.html'),
    protocol: 'file:',
    slashes: true
  }));

  //editSaleWindow.webContents.openDevTools()

  editSaleWindow.on('close', function(e) {
    editSaleWindow.hide();
    e.preventDefault();
  });
}


/*=============  CLIENTS  ============================*/
// READ CLIENTS TABLE from the db
function readClientsFromDB()
{
  knex.select().from("clients")
  .then(function(rows){
      mainWindow.webContents.send('client:add',rows); 
  })
  .catch((err) => { console.log( err); throw err })
}

// DELETE A CLIENT from the db
function deleteClientFromDb(id) {
  knex("clients").where("id", id).del()
  .then(() => console.log("record deleted"))
  .catch((err) => { console.log( err); throw err })
}

// ADD A CLIENT to the db
function addClientToDb(obj) {
  knex("clients").insert(obj)
  .then(() => console.log("data inserted"))
  .catch((err) => { console.log( err); throw err });
}

// UPDATE A CLIENT from the db
function updateClientFromDb(obj) {
  knex("clients").where({id: obj.id})
  .update({name: obj.name, phone: obj.phone, email: obj.email})
  .then(() => console.log("record updated"))
  .catch((err) => { console.log( err); throw err })  
}

/*=============  PRODUCTS  ============================*/
// READ PRODUCTS TABLE from the db
function readProductsFromDB()
{
  knex.select().from("products")
  .then(function(rows){
      mainWindow.webContents.send('product:add',rows); 
  })
  .catch((err) => { console.log( err); throw err })
}

// DELETE A PRODUCT from the db
function deleteProductFromDb(id) {
  knex("products").where("id", id).del()
  .then(() => console.log("record deleted"))
  .catch((err) => { console.log( err); throw err })
}

// ADD A PRODUCT to the db
function addProductToDb(obj) {
  knex("products").insert(obj)
  .then(() => console.log("data inserted"))
  .catch((err) => { console.log( err); throw err });
}

// UPDATE A PRODUCT from the db
function updateProductFromDb(obj) {
  knex("products").where({id: obj.id})
  .update({code: obj.code, name: obj.name, price: obj.price, quantity: obj.quantity})
  .then(() => console.log("record updated"))
  .catch((err) => { console.log( err); throw err })  
}

/*=============  SALES  ============================*/
// READ SALES TABLE from the db
function readSalesFromDB()
{
  knex.select().from("sales")
  .then(function(rows){
      mainWindow.webContents.send('sale:add',rows); 
  })
  .catch((err) => { console.log( err); throw err })
}

// DELETE A SALE from the db
function deleteSaleFromDb(id) {
  knex("sales").where("id", id).del()
  .then(() => console.log("record deleted"))
  .catch((err) => { console.log( err); throw err })
}

// ADD A SALE to the db
function addSaleToDb(obj) {
  knex("sales").insert(obj)
  .then(() => console.log("data inserted"))
  .catch((err) => { console.log( err); throw err });
}

// UPDATE A SALE from the db
function updateSaleFromDb(obj) {
  knex("sales").where({id: obj.id})
  .update({price: obj.price, total: obj.total})
  .then(() => console.log("record updated"))
  .catch((err) => { console.log( err); throw err })  
}


app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  //On OS X it is common for applications and their menu bar
  //to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
  // window.flashFrame(false); //I TRIED THIS
});




