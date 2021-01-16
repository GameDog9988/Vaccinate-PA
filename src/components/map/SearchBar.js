import React from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

export default function SearchBar(props) {
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => 40.4416941,
                lng: () => -79.9900861
            },
            radius: 100 * 1000
        }
    });
    
    const handleInput = (e) => {
        setValue(e.target.value);
    }

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng} = await getLatLng(results[0]);
            props.panTo({lat, lng});
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    return (
        <div className="border border-black transform translate-x-0 width-full max-w-screen-sm z-10 my-2">        
            <Combobox onSelect = { handleSelect }>
                <ComboboxInput 
                    value={value} 
                    onChange={handleInput} 
                    disabled ={!ready}
                    placeholder="Enter an address"
                    className="px-2 py-3 text-3xl height-full width-full"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && data.map(({id, description}) => ( 
                            <ComboboxOption 
                                key={id + description} value={description}
                                className="bg-white"                                
                                />
                            ) )}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}
