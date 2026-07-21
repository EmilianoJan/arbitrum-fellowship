# Installation steps

Got to [Nitro Testnode](https://github.com/OffchainLabs/nitro-testnode) and clone the repository (in other folder)

git clone -b release --recurse-submodules https://github.com/OffchainLabs/nitro-testnode.git

cd nitro-testnode

chmod +x test-node.bash

Only for the first time
sudo ./test-node.bash --init

initialization after installation
sudo ./test-node.bash

# Start monitor



# Data from the RCP




| Campo                | Descripción                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **number**           | Número del bloque dentro de la cadena L2. Es el identificador secuencial del bloque.                                                                                             |
| **hash**             | Hash SHA3/Keccak del bloque. Identifica de forma única ese bloque.                                                                                                               |
| **parentHash**       | Hash del bloque anterior. Permite enlazar todos los bloques formando la blockchain.                                                                                              |
| **timestamp**        | Fecha y hora (Unix Timestamp) en la que el secuenciador creó el bloque.                                                                                                          |
| **transactions**     | Lista de transacciones incluidas en el bloque. Como llamaste con `false`, solo devuelve los hashes.                                                                              |
| **transactionsRoot** | Raíz del árbol de Merkle que contiene todas las transacciones del bloque. Permite verificar su integridad.                                                                       |
| **stateRoot**        | Hash de la raíz del estado global después de ejecutar todas las transacciones del bloque. Resume el estado completo de la blockchain.                                            |
| **receiptsRoot**     | Raíz del árbol de Merkle que contiene todos los receipts (resultados) de las transacciones del bloque.                                                                           |
| **logsBloom**        | Filtro Bloom de 2048 bits que permite saber rápidamente si el bloque podría contener determinados eventos (logs). Los clientes lo usan para acelerar búsquedas.                  |
| **gasLimit**         | Cantidad máxima de gas que el bloque puede consumir. En Arbitrum suele ser muy grande porque el modelo de gas es diferente al de Ethereum L1.                                    |
| **gasUsed**          | Cantidad total de gas consumida por todas las transacciones del bloque.                                                                                                          |
| **baseFeePerGas**    | Precio base del gas del bloque (EIP-1559). En Arbitrum se usa junto con el modelo de costos propio de Nitro.                                                                     |
| **difficulty**       | Dificultad de minería. En Ethereum Proof of Stake y en Arbitrum ya no tiene un significado práctico y suele ser un valor fijo o simbólico.                                       |
| **miner**            | Dirección del productor del bloque. En Arbitrum normalmente identifica al **Sequencer**. Por eso ves texto ASCII al final (`sequencer`).                                         |
| **nonce**            | Campo heredado de Proof of Work. En Arbitrum ya no tiene importancia práctica.                                                                                                   |
| **mixHash**          | Otro campo heredado de Proof of Work. En Arbitrum se reutiliza para almacenar información interna y no representa un cálculo de minería.                                         |
| **extraData**        | Datos adicionales incluidos por el productor del bloque. En Arbitrum puede contener información utilizada por Nitro.                                                             |
| **sha3Uncles**       | Hash de la lista de bloques "uncle". Como Arbitrum no utiliza uncles, normalmente tiene el valor constante correspondiente a una lista vacía.                                    |
| **uncles**           | Lista de bloques uncle. En Arbitrum siempre está vacía (`[]`).                                                                                                                   |
| **size**             | Tamaño del bloque serializado, en bytes.                                                                                                                                         |
| **l1BlockNumber**    | **(Específico de Arbitrum)** Número del bloque de Ethereum L1 que Nitro tomó como referencia cuando produjo este bloque L2. Muy útil para relacionar L1 y L2.                    |
| **sendCount**        | **(Específico de Arbitrum)** Cantidad acumulada de mensajes enviados desde L2 hacia L1 mediante el puente (bridge).                                                              |
| **sendRoot**         | **(Específico de Arbitrum)** Raíz de Merkle que resume todos los mensajes L2→L1 pendientes o registrados. Es utilizada por el bridge para demostrar la existencia de un mensaje. |
