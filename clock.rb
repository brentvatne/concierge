require 'clockwork'
require_relative './config/boot'
require_relative './config/environment'

include Clockwork

handler do |job|
end

every(1.minute, 'Performing bookings') {
  `rake perform_bookings`
}
