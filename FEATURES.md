# HomeConnect 2.0 — Added Features

The existing rental workflow was retained and the interface was redesigned around a cleaner modern marketplace experience.

## UI/UX improvements

- Modern responsive navigation
- New hero/landing section
- Glassmorphism cards and subtle gradients
- Mobile navigation menu
- Consistent typography, spacing and status badges
- Responsive tenant, owner and admin dashboards
- Better login and registration experiences
- Better empty states and loading state

## Tenant features

- Property search
- Property type filter
- Maximum-budget filter
- Furnishing filter on the public explorer
- Saved/favourite properties using browser localStorage
- Property detail modal
- Preferred visit date
- Optional message to owner
- Booking status tracking
- Tenant dashboard metrics

## Owner features

- Portfolio metrics
- Listed monthly value metric
- Property publishing form
- My properties search
- Property deletion
- Booking request queue
- Confirm request
- Decline request
- Visit date and tenant message visibility
- Pending owner approval status

## Admin features

- Platform metrics
- Marketplace activity bars
- Owner verification queue
- User search
- User status view
- Property search
- Property cards
- Booking status dashboard

## Backend improvements

- Booking requests now accept `visitDate` and `message`
- Added property update API for future editing support
- Existing JWT role protection retained
- Existing owner approval workflow retained
- Existing local JSON database retained for easy setup
