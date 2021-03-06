import ItemDetail from '../../components/ItemDetail/ItemDetail'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import { getFirestore } from '../../firebase'
import NoMatch from '../../components/NoMatch/NoMatch'


const ItemDetailContainer = () => {

    const [itemState, setItemState] = useState([])
    const [loading, setLoading] = useState(true)
    let { id } = useParams()

    useEffect(() => {

        setLoading(true)

        const db = getFirestore()
        const itemColection = db.collection('Items')

        itemColection.get()
            .then((querySnapshot) => {

                if (querySnapshot.size === 0) {
                    console.log('no hay resultados a la query')
                    return
                }

                let arrayItems = querySnapshot.docs.map((doc) => {
                    return ({
                        id: doc.id,
                        ...doc.data()
                    })
                })

                const result = arrayItems.filter(item => item.id === id)
                setItemState(result)

            }).catch((error) => {
                console.log('Error buscando obteniendo los datos', error)

            }).finally(() => {
                setLoading(false)
            })

    }, [id])


    return (
        <React.Fragment>
                {loading ? <Loader />
                    : (itemState.length > 0) ? <ItemDetail item={itemState[0]} />
                        : <NoMatch  itemId={id}/>}
        </React.Fragment>
    )
}

export default ItemDetailContainer