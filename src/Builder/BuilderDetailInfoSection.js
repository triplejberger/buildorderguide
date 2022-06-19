import DatabaseService from '../DatabaseService'
import debounce from 'lodash/debounce'
import BuildData from '../Builds/BuildData'
import * as Constants from '../Constants'
import CivInfoService from '../Uptime/CivInfoService'
import Heading2 from '../UI/Heading2'
import Input from '../UI/Input'
import Dropdown from '../UI/Dropdown'

const BuilderDetailInfoSection = (props) => {

    const handleTitleChange = debounce(value => {
        let title = value.replace(/->/g, '→')
        title = title.match(/[A-z0-9\s+→]*/g).join('') // Allow only characters and two special characters
        title = title.replace(/into/gi, '→')
        title = title.replace(/(pre)(\s)*(mill)/gi, 'Pre-Mill') // Make sure Pre-Mill is always spelled the same way
        title = title.replace(/(((man|men)(\s)*(at)(\s)*(arms))|(MAA))/gi, 'Men-at-Arms') // Make sure Men-at-Arms are always spelled the same way
        title = title.replace(/(((pop)\s*\d+)|(\d+\s*(pop)))/gi, '') // Remove mentions of pop in title
        title = title.split(' ').map(element => element.charAt(0).toUpperCase() + element.slice(1)).join(' ') // Make every new word start with uppercase
        title = title.replace(/ +(?= )/g, '').trim() // Remove multiple white spaces that might happen after not allowed characters were removed

        props.setTitle(title)
    }, 250)

    const handleDescriptionChange = debounce(value => {
        props.setDescription(value)
    }, 250)

    const handleClickOnDifficulty = (event) => {
        props.setDifficulty(event.value)
    }

    const handleClickOnAttributes = (event) => {
        let attributes = []
        if (event !== null && event.length > 0) {
            event.forEach((item, i) => {
                attributes.push(item.value)
            })
        }
        props.setAttributes(attributes)
    }

    const handleClickOnCivilization = (event) => {
        props.setCivilization(event.value)
    }

    const handleClickOnImage = (event) => {
        props.setImage(event.value)

        DatabaseService.getImageURLWithName(event.value).then(URL => {
            props.setImgURL(URL)

        }, (error) => {
            console.log(error)
        })
    }

    const handleAuthorChange = debounce(value => {
        props.setAuthor(value)
    }, 250)

    const handleReferenceChange = debounce(value => {
        props.setReference(value)
    }, 250)

    let civOptions = [
        { value: Constants.Civ.Generic, label: <div class='flex space-x-2'><img class='w-8 h-8' src={require('../Images/Civilizations/Generic.png')} alt={Constants.Civ.Generic} /><span >Generic</span></div> },
        { value: Constants.Civ.Meso, label: <div class='flex space-x-2'><img class='w-8 h-8' src={require('../Images/Civilizations/Meso.png')} alt={Constants.Civ.Meso} /><span >Meso</span></div> }
    ]
    CivInfoService.getCivilizations().forEach((item, i) => {
        civOptions.push({ value: item, label: <div class='flex space-x-2'><img class='w-8 h-8' src={require('../Images/Civilizations/' + item + '.png')} alt={item} /><span >{item}</span></div> })
    })

    let difficultyOptions = [{ value: 1, label: Constants.Difficulty.Beginner }, { value: 2, label: Constants.Difficulty.Intermediate }, { value: 3, label: Constants.Difficulty.Advanced }]

    return (
        <div class='w-1/2 m-auto mt-12'>
            <div class='mt-6'>
                <Heading2>Title</Heading2>
                <Input value={props.title} onChange={event => { handleTitleChange(event.target.value) }} placeholder='Title of build' />
                <p class='text-xs text-main-dark'>Allowed special characters: <span>→</span> <span >+</span> (Everything else will be automatically removed on save!)</p>
                <p class='text-xs text-main-dark'>Don't add the civ or the pop number to the title. Both will be added automatically when publishing.</p>
            </div>
            <div class='mt-6'>
                <Heading2>Civilization</Heading2>
                <Dropdown isSearchable={true} value={civOptions.find(element => element.value === props.civilization)} onChange={handleClickOnCivilization} options={civOptions} components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} placeholder='Select civilization' />
            </div>
            <div class='mt-6'>
                <Heading2>Description</Heading2>
                <textarea class='bg-secondary-light text-main-dark placeholder-main-light border-transparent w-full p-2 rounded-sm' defaultValue={props.description} onChange={event => { handleDescriptionChange(event.target.value) }} placeholder='Build description'></textarea>
            </div>
            <div class='mt-6'>
                <Heading2>Difficulty</Heading2>
                <Dropdown isSearchable={true} value={difficultyOptions.find(element => element.value === props.difficulty)} onChange={handleClickOnDifficulty} options={difficultyOptions} components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} placeholder='Select difficulty' />
            </div>
            <div class='mt-6'>
                <Heading2>Attributes</Heading2>
                <Dropdown isSearchable={true} isMulti={true} value={BuildData.getBuildAttributes().filter(element => props.attributes !== undefined && props.attributes.includes(element.value))} onChange={handleClickOnAttributes} options={BuildData.getBuildAttributes()} components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} placeholder='Select attributes' />
            </div>
            <div class='mt-6'>
                <Heading2>Image</Heading2>
                <Dropdown isSearchable={true} value={props.availableImages === null || props.image === null ? '' : props.availableImages.find(element => element.value === props.image)} onChange={handleClickOnImage} options={props.availableImages} components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} placeholder='Select image' />
            </div>
            <div class='mt-6'>
                <Heading2>Author</Heading2>
                <Input value={props.author} onChange={event => { handleAuthorChange(event.target.value) }} placeholder='Name of author' />
                <p class='text-xs'>Enter the author of the build. If Viper came up with the build, Viper is the author, not you. (Unless you are Viper!)</p>
            </div>
            <div class='mt-6'>
                <Heading2>Source</Heading2>
                <Input value={props.reference} onChange={event => { handleReferenceChange(event.target.value) }} placeholder='Link to source' />
            </div>
        </div>
    )
}

export default BuilderDetailInfoSection