import Image from 'next/image'
import style from './UserList.module.css'

export const UserList = ({ userList }) => {
    return (<div className={style.list}>
        {
            userList?.map((user, index) => {
                return <div key={index} className={style.element}>
                     <Image  src={`/${user.superHeroImage}.png`} width={50} height={50} className={style.avatar}alt="Picture of the author" />
                    <p>{user.name}</p>
                    <p>{`${user.completed}%`}</p>
                    
                </div>
            })}
    </div>)
    
}