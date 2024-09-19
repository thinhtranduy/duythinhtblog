import React from 'react'
import { Mic, Video, Tag, Lightbulb, ShoppingBag, Heart, LucideTrophy, StarIcon, RouteIcon, Route, BookAIcon, ThumbsUpIcon, SmileIcon, EyeIcon} from 'lucide-react'
import { FaSquareFacebook, FaSquareGithub, FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { FaTwitch, FaMastodon } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import HomeIcon from './IconFolder/HomeIcon';
import DEV from './IconFolder/DEV++';
import ReadingListIcon from './IconFolder/ReadingList';
import PodcastIcon from './IconFolder/PodcastIcon';
import VideosIcon from './IconFolder/VideosIcon';
import Tags from './IconFolder/Tags';
import DevHelp from './IconFolder/DevHelp';
import ForemShop from './IconFolder/ForemShop';
import Advertise from './IconFolder/Advertise';
import DevChallenge from './IconFolder/DevChallenge';
import Showcase from './IconFolder/Showcase';
import Contact from './IconFolder/Contact';
import Guides from './IconFolder/Guides';
import CodeOfConduct from './IconFolder/CodeOfConduct';
import PrivacyPolicy from './IconFolder/PrivacyPolicy';
import TermOfUse from './IconFolder/TermOfUse';
interface MenuButtonProps {
  children: React.ReactNode;
}
const MenuButton: React.FC<MenuButtonProps> = ({ children }) => {
    return (
      <button className='w-full h-full flex gap-2 object-contain text-black font-light  text-items-start text-lg font-sans rounded-lg border-inherit px-2 py-2 my-5 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'>
        {children}
      </button>
    );
  };
const MenuBar = () => {
  return (
    <div>
        <div className='pb-10 '>
            <MenuButton> {<HomeIcon/>}  Home</MenuButton>
            <MenuButton> {<img src='/devpp.svg' className='h-6 w-6 mr-2'/>}  DEV++</MenuButton>
            <MenuButton> {<ReadingListIcon/>}  Reading List</MenuButton>
            <MenuButton> {<PodcastIcon/>}Podcasts</MenuButton>
            <MenuButton> {< VideosIcon/>}Videos</MenuButton>
            <MenuButton> {<Tags/>}Tags</MenuButton>
            <MenuButton> {<DevHelp/>}DEV Help</MenuButton>
            <MenuButton> {<ForemShop/>}Forem Shop</MenuButton>
            <MenuButton> {<Advertise/>}Advertise on DEV</MenuButton>
            <MenuButton> {<DevChallenge/>}DEV Challenges</MenuButton>
            <MenuButton> {<Showcase/>}DEV Showcases</MenuButton>
            <MenuButton> {<img src='/Deviologo.png' className='h-6 w-6 mr-2'></img>}About</MenuButton>
            <MenuButton> {<Contact/>}Contact</MenuButton>
            <MenuButton> {<img src='/menu_ic_guides.svg' className='h-6 w-6 mr-2'/>}Guides</MenuButton>
            <MenuButton> {<img src='/menu_ic_soft_comparsion.svg' className='h-6 w-6 mr-2'/>}Software Comparisons</MenuButton>
        </div>

        <div className='pb-5'>
            <span className='font-bold text-xl text-black '>Other</span>
        </div>

        <div className='pb-10'>
            <MenuButton> {<CodeOfConduct/>} Code of Conduct</MenuButton>
            <MenuButton> {<PrivacyPolicy/>}Privacy Policy</MenuButton>
            <MenuButton> {<TermOfUse/>}Terms of use</MenuButton>    
        </div>

        <div className='flex'>
            <MenuButton>{<FaSquareXTwitter className='h-6 w-6'/>}</MenuButton>
            <MenuButton>{<FaSquareFacebook className='h-6 w-6'/>}</MenuButton>
            <MenuButton>{<FaSquareGithub className='h-6 w-6'/>}</MenuButton>
            <MenuButton>{<FaSquareInstagram className='h-6 w-6'/>}</MenuButton>
            <MenuButton>{<FaTwitch className='h-6 w-6'/>}</MenuButton>
            <MenuButton>{<FaMastodon className='h-6 w-6'/>}</MenuButton>

        </div>
    </div>

    
  )
}

export default MenuBar