import { checklist, checklistKeys } from "../../types"


// toma los valores de un objeto tipo 'checklist' y los introduce a una sentencia SQL 
export const getInsertInto = (table: string, object: checklist): string=> {
    
    let columnString = ''
    let valuesString = ''
    const keys = <checklistKeys[]> Object.keys(object)

    keys.map((itemKey: checklistKeys)=> {  
       
        // dependiendo del tipo de valor le agrega ' ' o convierte los booleanos en 1 o 0
        switch (typeof(object[itemKey])){
            case 'string': 
                valuesString+= "'" + object[itemKey] + "',"
                break
            case 'boolean':
                valuesString+= object[itemKey] == 'true' ? '1,' : '0,'
                break
            default: 
                valuesString+= object[itemKey] + ','
                break       
        }
        columnString += itemKey + ','
    })

    // le quita la ultima coma al texto de la consulta
    const valuesStringWithoutLast = valuesString.slice(0, -1)
    const columnStringWithoutLast = columnString.slice(0, -1)
    const query = `INSERT INTO ${table}(${columnStringWithoutLast}) VALUES(${valuesStringWithoutLast})`
    
    return query
}