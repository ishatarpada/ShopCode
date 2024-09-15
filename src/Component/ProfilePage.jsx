import ProfileInfo from './profileInfo'
import Address from './Address'

export default function ProfilePage() {
  return (
    <>
      <div className="relative mx-auto w-full my-10 bg-white container">
        <div className="grid min-h-auto grid-cols-10">
          <ProfileInfo />
          <Address />
        </div>
      </div>
    </>
  )
}
