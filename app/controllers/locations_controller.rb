class LocationsController < ApplicationController

  def address_for_coords
    result = Geokit::Geocoders::GoogleGeocoder.geocode("#{params[:lat]} #{params[:lon]}")

    if result.success?
      render json: {
        address: result.full_address
      }
    else
      render json: {
        error: "Could not find address"
      }
    end
  end
end
