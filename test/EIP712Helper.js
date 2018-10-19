const ethUtil = require('ethereumjs-util');
const abi = require('ethereumjs-abi');



module.exports = class EIP712Helper{

    // Recursively finds all the dependencies of a type
    static  dependencies(primaryType, types, found = []) {
        if (found.includes(primaryType)) {
            return found;
        }
        if (types[primaryType] === undefined) {
            return found;
        }
        found.push(primaryType);
        for (let field of types[primaryType]) {
            for (let dep of EIP712Helper.dependencies(field.type, types, found)) {
                if (!found.includes(dep)) {
                    found.push(dep);
                }
            }
        }
        return found;
    }

    static  encodeType(primaryType, types) {
        // Get dependencies primary first, then alphabetical
        let deps = EIP712Helper.dependencies(primaryType, types);
        deps = deps.filter(t => t != primaryType);
        deps = [primaryType].concat(deps.sort());

        // Format as a string with fields
        let result = '';
        for (let type of deps) {
            result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(',')})`;
        }

        return result;
    }

    static typeHash(primaryType, types) {
        return ethUtil.sha3(EIP712Helper.encodeType(primaryType, types));
    }

    static encodeData(primaryType, data, types) {
        let encTypes = [];
        let encValues = [];

        // Add typehash
        encTypes.push('bytes32');
        encValues.push(EIP712Helper.typeHash(primaryType, types));

        // Add field contents
        for (let field of types[primaryType]) {
            let value = data[field.name];
            if (field.type == 'string' || field.type == 'bytes') {
                encTypes.push('bytes32');
                value = ethUtil.sha3(value);
                encValues.push(value);
            } else if (types[field.type] !== undefined) {
                encTypes.push('bytes32');
                value = ethUtil.sha3(EIP712Helper.encodeData(field.type, value, types));
                encValues.push(value);
            } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                throw 'TODO: Arrays currently unimplemented in encodeData';
            } else {
                encTypes.push(field.type);
                encValues.push(value);
            }
        }
        console.log('encValues',encValues)
        return abi.rawEncode(encTypes, encValues);
    }

    static structHash(primaryType, data, types) {
        return ethUtil.sha3(EIP712Helper.encodeData(primaryType, data, types));
    }



  }
