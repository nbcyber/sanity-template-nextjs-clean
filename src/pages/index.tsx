import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect, useState } from 'react'

import Card from '~/components/Card'
import Container from '~/components/Container'
import Welcome from '~/components/Welcome'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

const filePath = '../assets/pizza.jpg'
const newFile = (filePath)
const client = getClient();


export default function IndexPage() {
  const [addedMedia, setAddedMedia] = useState<File>()
  const [fetchedMedia, setFetchedMedia] = useState([])

  const fetchMediaDocuments = async () => {
    await client.fetch('*[_type == "media"]').then((res) => {
      setFetchedMedia([...res])
      console.log(`Here are all of the Media documents you have fetched: ${res}`)
    })
  }

  useEffect(() => {
    fetchMediaDocuments()
  }, [])


  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAddedMedia(event.target.files[0]);
    }
  }





  const createMedia = async () => {
    await client.assets.upload('image', addedMedia).then((res) => {
      console.log(res)
      const mediaDoc = {
        _type: 'media',
        name: res._createdAt,
        assetId: res._id,
        assetURL: res.url,
      }
      client.create(mediaDoc).then((mediaRes) => {
        console.log(mediaRes);
      })
      return mediaDoc;
    })
  }

  const handleDelete = async (media) => {
    // im pretty sure im setting fetched media 
    // setFetchedMedia([...fetchedMedia.splice(fetchedMedia.indexOf(media),1)])
    await client.delete(media.assetId).then((res) => {
      console.log(`Media document deleted: ${JSON.stringify(res)}`)

    }).then(() => {
      client.delete(media._id).then((r) => {
        console.log(`Asset deleted: ${JSON.stringify(r)}`)
      })
    })

  }
  return (
    <>
      <input type="file" onChange={onImageChange} className="filetype" />
      <button onClick={() => { createMedia() }}>Upload Media Document</button>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        {
          fetchedMedia.map((mediaItem) => {
            return <div style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '20px'
            }}><img src={mediaItem.assetURL} height={100} width={100}></img> <button onClick={() => handleDelete(mediaItem)}>Delete Me!</button></div>
          })
        }
      </div>

    </>
  )
}
