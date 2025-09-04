import { Sequelize } from "sequelize";

import { databaseConfig } from '../database/config'

class DataBase {
    declare connection: Sequelize

    constructor() {
        this.init()
    }

    init() {
        this.connection = new Sequelize(databaseConfig)

        // this.connection.sync()
    }
}

export default new DataBase().connection