import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useState } from 'react'

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


  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAddedMedia(event.target.files[0]);
    }
   }
   
  // sanity doesnt want the fucking url
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


  return (
    <>
        <input type="file" onChange={onImageChange} className="filetype" />
        <button onClick={() => {createMedia()}}>This button will destroy it all</button>

    </>
  )
}
