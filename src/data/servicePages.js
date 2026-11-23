// Service pages linked from the footer ("Services").
// One source of truth for the page text, the SEO tags, and which listings appear.
// Used by src/pages/ServicePage.jsx (in the browser) and by
// scripts/prerender-services.mjs (builds static HTML so search engines see the full text).
//
// Edit text here. Paragraphs may contain internal links written as [link text](/path).
// propertyTypes: which listing "Property Type" values are shown (empty = no listings).

export const SITE_ORIGIN = "https://farislee.com";
export const SITE_NAME = "Faris Lee Investments";
export const PHONE = "(949) 221-1800";
export const PHONE_HREF = "tel:949-221-1800";
export const EMAIL = "info@farislee.com";
export const ADDRESS = { street: "18101 Von Karman Ave, Suite 1100", city: "Irvine", region: "CA", postal: "92612", country: "US" };

export const servicePath = (slug) => `/services/${slug}`;

export const servicePages = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "multi-tenant-retail-strip-center",
    title: "Multi-Tenant Retail Strip Center",
    seoTitle: "Multi-Tenant Retail Strip Centers for Sale | Faris Lee",
    metaDescription:
      "Buy or sell a multi-tenant retail strip center with Faris Lee Investments. Strip center brokerage, valuation and current multi-tenant retail listings.",
    eyebrow: "Retail Investment Sales",
    intro:
      "Multi-tenant retail strip centers are among the most resilient and widely traded commercial real estate assets in the country. Faris Lee Investments advises owners and investors on the acquisition and disposition of neighborhood strip centers, unanchored retail and community shopping centers nationwide, combining decades of retail-only transaction experience with national buyer reach.",
    sections: [
      {
        heading: "What Is a Multi-Tenant Retail Strip Center?",
        paragraphs: [
          "A multi-tenant retail strip center is a shopping center made up of several attached storefronts, typically arranged in a straight line or an \"L\" shape with parking directly in front of the stores. Strip centers are built to serve daily, convenience-driven needs, so their tenant rosters usually include quick-service and fast-casual restaurants, coffee, nail and hair salons, dental and medical offices, fitness studios, dry cleaners, cellular stores, insurance and tax offices, and other local and regional service businesses.",
          "Strip centers range from small unanchored properties with a handful of shops to larger neighborhood centers. Some are \"shadow-anchored\", meaning they sit next to a grocery store, big-box retailer or other traffic generator that the strip center does not own but benefits from. Centers with an owned anchor tenant are covered on our [Anchored Commercial Property](/services/anchored-commercial-property) page.",
        ],
      },
      {
        heading: "Why Investors Buy Multi-Tenant Retail",
        paragraphs: [
          "The defining strength of a multi-tenant strip center is diversification. Income is spread across many tenants, so the loss of any single tenant has a limited effect on the property's total cash flow, unlike a single-tenant building where one vacancy means no income at all. Service, food and medical tenants that depend on in-person visits have also proven far less vulnerable to e-commerce than traditional soft-goods retail.",
          "Strip centers also offer something passive net-lease assets rarely do: a clear path to grow income. Shorter lease terms allow an owner to mark rents to market as leases roll, re-merchandise the tenant mix, lease up vacancy, add pad sites or improve the property's appearance and signage. For investors willing to take a hands-on approach, these value-add opportunities can create meaningful equity over the hold period.",
        ],
      },
      {
        heading: "Lease Structures and Operating Income",
        paragraphs: [
          "Most multi-tenant retail leases are written on a triple-net (NNN) basis. Each tenant pays base rent plus its pro-rata share of the center's operating costs, typically property taxes, insurance and common area maintenance (CAM) such as parking lot repairs, landscaping, lighting and property management. Because expenses are reimbursed, the owner's net operating income is driven primarily by occupancy and base rent levels.",
          "Even with NNN leases, strip centers require active management. Owners or their property managers handle annual CAM reconciliations, tenant relations, leasing, roof and parking lot capital planning and collections. Buyers should understand which costs are recoverable, whether any tenants have caps on CAM increases, and what capital items the landlord remains responsible for.",
        ],
      },
      {
        heading: "Key Due Diligence for Strip Center Buyers",
        paragraphs: [
          "Evaluating a multi-tenant retail center starts with the rent roll: lease expirations, renewal options, rent escalations and the credit and operating history of each tenant. A heavy concentration of lease expirations in the same year, or a large share of income from one tenant, can change the risk profile of an otherwise diversified property.",
          "Buyers should also review tenant estoppel certificates, CAM reconciliations and recovery ratios, co-tenancy and exclusive-use clauses, historical occupancy, deferred maintenance, parking ratios and site access. Location fundamentals matter most of all: traffic counts, visibility, ingress and egress, surrounding household incomes and population density, and the strength of nearby traffic generators all drive long-term leasing demand.",
        ],
      },
      {
        heading: "How Faris Lee Investments Sells Strip Centers",
        paragraphs: [
          "Faris Lee has a long track record in the strategic disposition of neighborhood retail centers and dominant community centers. Every assignment starts with underwriting the property from every angle, including in-place income, lease-up and mark-to-market upside, and the story a buyer needs to believe in the asset. From there we build a tailored marketing campaign that reaches private investors, high-net-worth family offices, 1031 exchange buyers and institutional capital across our national network.",
          "Because retail investment sales is all we do, our advisors understand how tenant mix, lease structure and trade area translate into value, and how to defend that value through due diligence and closing. Learn more about [our expertise](/expertise), browse [all available listings](/listings), or [contact our team](/Team) for a confidential valuation of your center.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between a strip center and a shopping center?",
        a: "A strip center is a type of shopping center: a row of attached storefronts with parking in front, usually serving convenience needs. Larger shopping centers such as community and power centers typically include one or more large anchor tenants and cover more land.",
      },
      {
        q: "Are multi-tenant retail centers a good investment?",
        a: "They can be. Multi-tenant centers spread income across many tenants, which reduces the impact of any single vacancy, and their shorter leases give owners the chance to raise rents over time. In exchange they require more management than single-tenant net lease properties, so the right fit depends on your goals and how involved you want to be.",
      },
      {
        q: "Who pays the expenses in a multi-tenant strip center?",
        a: "Most strip center leases are triple-net, so tenants reimburse their share of property taxes, insurance and common area maintenance in addition to base rent. The landlord typically remains responsible for certain capital items and any costs not recoverable under the leases.",
      },
      {
        q: "What is an unanchored strip center?",
        a: "An unanchored strip center has no large anchor tenant such as a grocery store. Its tenants are smaller shops and service businesses, and its traffic depends on location, visibility and the convenience of its tenant mix.",
      },
    ],
    propertyTypes: ["Multi Tenant", "Grocery Anchored"],
    listingsHeading: "Available Multi-Tenant Retail Listings",
    emptyListings: "There are no multi-tenant retail centers on the market right now.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "single-tenant-commercial-property",
    title: "Single Tenant Commercial Property",
    seoTitle: "Single Tenant Commercial Property for Sale | Faris Lee",
    metaDescription:
      "Single tenant commercial property for sale nationwide. Faris Lee brokers single tenant restaurant, bank, auto, pharmacy and medical retail properties.",
    eyebrow: "Retail Investment Sales",
    intro:
      "Single tenant commercial properties, buildings leased in their entirety to one business, are one of the most popular entry points into commercial real estate investing. Faris Lee Investments represents buyers and sellers of single tenant retail properties across the United States, from quick-service restaurants and coffee drive-thrus to banks, auto service, pharmacies and medical retail.",
    sections: [
      {
        heading: "What Is a Single Tenant Commercial Property?",
        paragraphs: [
          "A single tenant commercial property is a freestanding building, or a building on its own parcel, occupied and leased by one tenant. In retail real estate, common examples include fast-food and fast-casual restaurants, coffee shops, convenience stores and fuel stations, banks, auto parts and auto service stores, dollar stores, pharmacies, urgent care and dental clinics, and fitness facilities.",
          "Single tenant properties can be leased under a variety of structures. Many are net leased, where the tenant pays some or all of the property's taxes, insurance and maintenance, which we cover in depth on our [Single Tenant Net Lease Property](/services/single-tenant-net-lease-property) page. Others are leased on a modified gross basis where the landlord retains more of the expenses. The lease structure has a direct effect on the property's management requirements and on how investors value it.",
        ],
      },
      {
        heading: "Why Investors Choose Single Tenant Properties",
        paragraphs: [
          "Single tenant properties are prized for their simplicity. With one lease, one tenant and one rent check, ownership is far easier to understand and manage than a multi-tenant center. When the tenant is a well-capitalized company on a long-term lease, the investment can provide stable, predictable income that resembles a bond, backed by real estate.",
          "These properties also come in a wide range of price points, which makes them accessible to individual investors as well as family offices and institutions. They are a frequent choice for buyers completing a [1031 exchange](/services/1031-properties), because a long-term lease can replace a management-intensive property with a largely passive one.",
        ],
      },
      {
        heading: "Understanding the Risks",
        paragraphs: [
          "The flip side of a single tenant is concentration. If the tenant leaves or fails, the property's income drops to zero until the space is re-leased. That makes the remaining lease term, the strength of the tenant and any lease guarantee, and the real estate itself the three most important factors in underwriting a single tenant deal.",
          "Experienced investors ask what the property would be worth with the tenant gone. A building on a high-traffic corner in a strong trade area, with rent at or below market and a layout that suits many users, carries far less downside than a specialized building in a weak location. Evaluating replacement tenant demand, re-tenanting costs and land value is central to sound single tenant investing.",
        ],
      },
      {
        heading: "What Drives Value",
        paragraphs: [
          "Single tenant properties are typically priced by capitalization rate: the property's annual net operating income divided by its price. Cap rates for single tenant assets generally reflect the tenant's credit and the guarantor behind the lease, the years remaining on the lease, the size and frequency of rent increases, the lease type and landlord responsibilities, and the quality of the location.",
          "A corporately guaranteed lease to a national brand with fifteen or more years remaining and regular rent bumps will usually trade at a lower cap rate (a higher price) than a franchisee lease with a few years left. Understanding where a property sits on that spectrum, and how to present it to the right buyers, is where an experienced broker adds value.",
        ],
      },
      {
        heading: "Single Tenant Brokerage at Faris Lee Investments",
        paragraphs: [
          "Faris Lee advises owners, developers and investors on single tenant retail transactions nationwide, including dispositions, acquisitions, portfolio sales and sale-leasebacks. We combine national pricing data and deep tenant knowledge with a buyer network of private investors, 1031 exchange buyers, family offices and institutions to position each property for its best possible outcome.",
          "Explore [current listings](/listings), learn about [our expertise](/expertise), or [reach out to our team](/Team) to discuss the value of your single tenant property.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a single tenant commercial property?",
        a: "It is a commercial building leased in its entirety to one tenant, such as a restaurant, bank, pharmacy, auto service store or medical clinic. The owner's income comes from that one lease.",
      },
      {
        q: "Is single tenant the same as net lease?",
        a: "Not always. Many single tenant properties are net leased, meaning the tenant pays taxes, insurance and maintenance, but some are leased on a gross or modified gross basis where the landlord pays more of the expenses. Always review the lease to see who is responsible for what.",
      },
      {
        q: "What happens if the tenant leaves?",
        a: "The property stops producing rent until a new tenant is found, so the remaining lease term, the tenant's credit and the quality of the location are critical. Properties in strong locations with flexible buildings are easier to re-lease.",
      },
      {
        q: "Are single tenant properties good for a 1031 exchange?",
        a: "They are among the most common 1031 replacement properties because they come in many price points and, with long-term leases, can offer predictable income with limited management.",
      },
    ],
    propertyTypes: ["Single Tenant"],
    listingsHeading: "Available Single Tenant Listings",
    emptyListings: "There are no single tenant properties on the market right now.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "anchored-commercial-property",
    title: "Anchored Commercial Property",
    seoTitle: "Anchored & Grocery-Anchored Centers for Sale | Faris Lee",
    metaDescription:
      "Grocery-anchored and anchored shopping centers for sale. Faris Lee brokers neighborhood and community retail centers for private and institutional buyers.",
    eyebrow: "Retail Investment Sales",
    intro:
      "Anchored shopping centers combine the diversified income of multi-tenant retail with the steady customer traffic of a major anchor tenant. Faris Lee Investments advises owners and investors on the sale and acquisition of grocery-anchored neighborhood centers, community centers and other anchored retail properties across the country.",
    sections: [
      {
        heading: "What Is an Anchored Commercial Property?",
        paragraphs: [
          "An anchored commercial property is a multi-tenant shopping center built around one or more large tenants, the \"anchors\", that draw customers to the center. Grocery stores are the most sought-after anchors because shoppers visit them several times a week. Other common anchors include drugstores, discount and off-price retailers, home improvement stores, fitness clubs and big-box retailers.",
          "Smaller \"in-line\" shops and pad buildings around the anchor, such as restaurants, banks, salons and medical tenants, benefit from the traffic the anchor generates. This relationship between anchor and in-line tenants is what distinguishes an anchored center from an [unanchored multi-tenant strip center](/services/multi-tenant-retail-strip-center).",
        ],
      },
      {
        heading: "Types of Anchored Centers",
        paragraphs: [
          "Neighborhood centers are typically anchored by a supermarket and provide everyday convenience goods and services to the surrounding residential area. Community centers are larger and usually include several anchors, such as a grocery store paired with discount, off-price or home goods retailers. Power centers are dominated by multiple big-box anchors with relatively few small shops.",
          "Some centers are \"shadow-anchored\": the anchor sits on its own separately owned parcel next to the center. Shadow-anchored properties can benefit from anchor traffic at a lower price point, but buyers should understand that the anchor is not part of their income or their control.",
        ],
      },
      {
        heading: "Why Grocery-Anchored Retail Is in Demand",
        paragraphs: [
          "Grocery-anchored centers are among the most sought-after property types in commercial real estate. Necessity-based shopping keeps traffic consistent through economic cycles, grocery stores have proven resistant to e-commerce, and that daily traffic supports strong occupancy and rents for the center's in-line tenants. These qualities make grocery-anchored retail attractive to private investors, family offices, REITs, pension funds and other institutional capital, and generally easier to finance than unanchored retail.",
          "The anchor's long-term lease provides a stable base of income, while the in-line space offers the leasing and rent-growth upside of multi-tenant retail. The combination of durability and upside is what makes a well-located anchored center a core holding for many portfolios.",
        ],
      },
      {
        heading: "Underwriting an Anchored Center",
        paragraphs: [
          "The anchor is central to value, so buyers study its lease closely: remaining term and renewal options, rent level relative to market, any rights to \"go dark\" (close while still paying rent), and the operator's performance at the location where sales are reported. A strong, well-performing anchor on a long lease supports the value of the entire center.",
          "Buyers should also review co-tenancy clauses, which can allow in-line tenants to reduce rent or terminate if the anchor closes, along with reciprocal easement agreements (REAs) that govern parking, signage and use restrictions, the in-line tenant rent roll and lease expirations, CAM recoveries and capital needs, and trade area demographics and competition from nearby centers.",
        ],
      },
      {
        heading: "Anchored Center Expertise at Faris Lee Investments",
        paragraphs: [
          "Faris Lee has a proven record selling dominant grocery-anchored community centers and neighborhood retail centers, including transactions with pension funds, institutional buyers and high-net-worth family offices. We underwrite every center from the anchor's position down to the last in-line suite, then run a tailored marketing process to the buyers best suited to the asset, often exceeding sellers' pricing expectations.",
          "Read our [retail investment success stories](/expertise), view [available listings](/listings), or [contact our advisors](/Team) to discuss your anchored center.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does \"anchored\" mean in commercial real estate?",
        a: "It means a shopping center has one or more large, well-known tenants, such as a grocery store or major retailer, that drive customer traffic to the property and support the smaller tenants around them.",
      },
      {
        q: "What is a grocery-anchored shopping center?",
        a: "A shopping center whose primary anchor is a supermarket. Because people shop for groceries frequently, these centers tend to have steady traffic and are especially popular with investors.",
      },
      {
        q: "What is a co-tenancy clause?",
        a: "A lease provision, common for in-line tenants, that lets the tenant pay reduced rent or terminate its lease if the anchor or a certain level of occupancy is lost. Buyers should review these clauses because they can affect income if the anchor leaves.",
      },
      {
        q: "What is a shadow-anchored center?",
        a: "A center located next to an anchor tenant that is owned separately. The center benefits from the anchor's traffic, but the anchor's lease and building are not part of the investment.",
      },
    ],
    propertyTypes: ["Multi Tenant", "Grocery Anchored"],
    listingsHeading: "Available Anchored & Multi-Tenant Listings",
    emptyListings: "There are no anchored or multi-tenant centers on the market right now.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "1031-properties",
    title: "1031 Properties",
    seoTitle: "1031 Exchange Replacement Properties | Faris Lee Investments",
    metaDescription:
      "Find 1031 exchange replacement properties with Faris Lee. Learn the 45-day and 180-day rules and why net lease retail suits exchange investors.",
    eyebrow: "1031 Exchange Investment Services",
    intro:
      "A 1031 exchange allows real estate investors to sell an investment property and reinvest the proceeds into another property while deferring capital gains taxes. Faris Lee Investments helps exchange buyers identify and acquire high-quality replacement properties within the exchange deadlines, and helps sellers reach the deep pool of motivated 1031 buyers.",
    sections: [
      {
        heading: "What Is a 1031 Exchange?",
        paragraphs: [
          "A 1031 exchange, named for Section 1031 of the Internal Revenue Code, lets an investor defer capital gains taxes, and depreciation recapture, when selling real property held for investment or for use in a business, provided the proceeds are reinvested in other \"like-kind\" real property. For real estate, like-kind is broad: an apartment building can be exchanged for a retail center, raw land for a [single tenant net lease property](/services/single-tenant-net-lease-property), and so on, as long as both are held for investment or business use within the United States.",
          "Since 2018, exchanges have been limited to real property. Personal residences, property held primarily for resale (such as fix-and-flip inventory) and interests in partnerships generally do not qualify.",
        ],
      },
      {
        heading: "The 45-Day and 180-Day Deadlines",
        paragraphs: [
          "Timing rules are strict. From the day the relinquished property closes, the investor has 45 calendar days to formally identify potential replacement properties in writing, and must complete the purchase within 180 calendar days of that sale (or by the due date of the tax return for that year, including extensions, if earlier). Weekends and holidays are not excluded, and the deadlines are generally not extended.",
          "Identification usually follows the three-property rule, which allows up to three properties of any value. Alternatives include the 200% rule, which allows more properties as long as their combined value does not exceed twice the value of the property sold, and the 95% rule, which allows any number of properties if the investor acquires at least 95% of the total value identified. Because the 45-day window passes quickly, many exchange buyers start searching for replacement property before their sale closes.",
        ],
      },
      {
        heading: "Qualified Intermediaries and Boot",
        paragraphs: [
          "The investor cannot take possession of the sale proceeds. Instead, a qualified intermediary (QI), sometimes called an exchange accommodator, holds the funds between the sale and the purchase and documents the exchange. Receiving the cash, even briefly, can disqualify the exchange.",
          "To defer all of the tax, investors generally need to buy replacement property of equal or greater value and reinvest all of the net proceeds, replacing any debt that was paid off with new debt or additional cash. Any cash taken out, or any reduction in debt that is not replaced, is called \"boot\" and is typically taxable. Variations such as reverse exchanges (buying before selling) and improvement exchanges are also available with careful planning.",
        ],
      },
      {
        heading: "Choosing the Right Replacement Property",
        paragraphs: [
          "Many exchange investors use a 1031 to move from management-intensive property, such as apartments or older multi-tenant buildings, into assets with more passive income. Net leased retail is a natural fit: a long-term lease to a strong tenant, with the tenant responsible for most expenses, can provide predictable income with minimal landlord involvement. Investors seeking more upside often choose [multi-tenant retail strip centers](/services/multi-tenant-retail-strip-center) or [anchored centers](/services/anchored-commercial-property), while others diversify across several [single tenant properties](/services/single-tenant-commercial-property).",
          "The pressure of the deadlines can tempt buyers to overpay or compromise on quality. A good replacement property still has to stand on its own: solid tenant credit, appropriate lease term, a strong location and pricing that makes sense even without the tax benefit.",
        ],
      },
      {
        heading: "1031 Exchange Advisory at Faris Lee Investments",
        paragraphs: [
          "Faris Lee is a recognized 1031 exchange specialist serving both private and institutional capital. We help exchange buyers source on- and off-market replacement properties that fit their identification deadlines and long-term goals, and we help sellers reach the many 1031 buyers in our national network, frequently using strategies such as dividing larger assets into parts that match exchange buyers' needs.",
          "Browse [our current listings](/listings) for potential replacement properties or [talk with an advisor](/Team) about your exchange timeline. Faris Lee works alongside your qualified intermediary, CPA and attorney; this page is general information, not tax or legal advice.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long do I have to complete a 1031 exchange?",
        a: "You must identify replacement properties within 45 days of selling your property and close on the replacement within 180 days of the sale, or by your tax return due date for that year if earlier. Both periods run at the same time.",
      },
      {
        q: "What properties qualify for a 1031 exchange?",
        a: "Real property held for investment or used in a trade or business, exchanged for other such real property in the United States. A personal residence or property held primarily for resale does not qualify.",
      },
      {
        q: "What is boot in a 1031 exchange?",
        a: "Boot is any value you receive that is not like-kind property, such as leftover cash or a reduction in mortgage debt that isn't replaced. Boot is generally taxable, even if the rest of the exchange is deferred.",
      },
      {
        q: "Do I need a qualified intermediary?",
        a: "Yes, for a standard delayed exchange. The qualified intermediary holds your sale proceeds and handles the exchange documents so that you never take receipt of the funds.",
      },
      {
        q: "Why are net lease properties popular for 1031 exchanges?",
        a: "They often come with long-term leases to established tenants who pay most property expenses, which gives exchange investors steady income with little management, and they are available in a wide range of price points.",
      },
    ],
    propertyTypes: [],
    disclaimer:
      "This page provides general information about 1031 exchanges and is not tax, legal or accounting advice. Consult your qualified intermediary, CPA or attorney about your specific situation.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "single-tenant-net-lease-property",
    title: "Single Tenant Net Lease Property",
    seoTitle: "Single Tenant Net Lease Properties | Faris Lee Investments",
    metaDescription:
      "Single tenant net lease (STNL) and NNN properties for sale. Faris Lee brokers investment-grade net lease retail, sale-leasebacks and ground leases.",
    eyebrow: "Single Tenant Net Lease Specialists",
    intro:
      "Single tenant net lease (STNL) properties offer investors long-term, low-management income backed by real estate. As recognized leaders in the STNL sector, Faris Lee Investments executes transactions for premium net lease assets nationwide, from investment-grade NNN retail in affluent markets to ground leases and sale-leasebacks.",
    sections: [
      {
        heading: "What Is a Single Tenant Net Lease Property?",
        paragraphs: [
          "A single tenant net lease property is a commercial building leased to one tenant under a lease that requires the tenant to pay some or all of the property's operating expenses in addition to rent. Because the tenant covers taxes, insurance and maintenance, the owner receives rent that is largely \"net\" of expenses. STNL properties are common across retail, including pharmacies, quick-service restaurants, coffee, dollar stores, auto parts and service, banks, grocery and convenience stores, as well as medical and other service uses.",
          "STNL is a specific kind of [single tenant commercial property](/services/single-tenant-commercial-property) defined by its expense structure. That structure is what makes these investments among the most passive in commercial real estate.",
        ],
      },
      {
        heading: "NNN, NN and Absolute Net Leases",
        paragraphs: [
          "Net leases are described by how many expenses the tenant pays. In a triple-net (NNN) lease, the tenant pays property taxes, insurance and maintenance. In a double-net (NN) lease, the landlord typically keeps responsibility for certain structural items, such as the roof and structure, or the parking lot. In an absolute net lease, sometimes called a bondable lease, the tenant is responsible for virtually everything, including major repairs and replacement, and the landlord has essentially no obligations.",
          "The difference matters. Two properties with the same rent and tenant can carry very different risk and value depending on who pays for a new roof or a repaved parking lot. Reading the lease carefully, rather than relying on the label \"NNN\", is an essential part of net lease due diligence.",
        ],
      },
      {
        heading: "Credit, Lease Term and Rent Growth",
        paragraphs: [
          "Because an STNL investment depends on one tenant's ability to pay, tenant credit is paramount. Investors pay close attention to whether the lease is guaranteed by the parent corporation or by a franchisee, and to the guarantor's financial strength; tenants with an investment-grade credit rating (BBB- or better from S&P, or Baa3 or better from Moody's) are especially sought after. Remaining lease term is equally important, as longer terms provide more certainty of income.",
          "Rent escalations protect investors against inflation. Some leases include annual increases, while others increase every five years or only during option periods. Together, credit, term, escalations, lease type and location determine an STNL property's cap rate and therefore its value.",
        ],
      },
      {
        heading: "Ground Leases, Sale-Leasebacks and Covered Land",
        paragraphs: [
          "In a ground lease, the investor owns the land and the tenant owns or builds the improvements. Ground leases are often considered among the safest net lease investments because the landlord has no building responsibilities and the land typically reverts to the owner, improvements included, at the end of the lease. In a sale-leaseback, an operating company sells its real estate to an investor and simultaneously signs a long-term lease, unlocking capital for the business while creating a new net lease investment.",
          "Faris Lee also advises on \"covered land\" plays: well-located properties in world-class trade areas where the existing lease provides income today while the underlying land and its redevelopment potential provide long-term, generational value.",
        ],
      },
      {
        heading: "STNL Due Diligence",
        paragraphs: [
          "Beyond the lease and the tenant, buyers should study the real estate as if the tenant were gone: rent compared with market rent, land value, building flexibility, traffic counts, visibility, access and demographics. They should also review any rights of first refusal, go-dark provisions, assignment and subletting rights, and the tenant's performance at the location where it is reported, along with title, survey, environmental and physical condition reports.",
          "Many STNL buyers are completing [1031 exchanges](/services/1031-properties), which adds deadlines to the process. Preparation and an advisor who knows the product type well help buyers move quickly without cutting corners.",
        ],
      },
      {
        heading: "Net Lease Brokerage at Faris Lee Investments",
        paragraphs: [
          "Faris Lee focuses on premium STNL assets featuring investment-grade tenants with long-term NNN leases in affluent markets, and advises across the full spectrum of net lease transactions, from single assets to national portfolios and sale-leasebacks. Our national buyer network includes private investors, 1031 exchange buyers, family offices, REITs and institutions.",
          "See [current listings](/listings), learn more about [our expertise](/expertise), or [contact our team](/Team) to discuss buying or selling a net lease property.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does NNN mean?",
        a: "NNN stands for triple-net. In a triple-net lease, the tenant pays the property taxes, insurance and maintenance costs in addition to rent, so the landlord's income is largely net of expenses.",
      },
      {
        q: "What is the difference between NNN and absolute NNN?",
        a: "In a standard NNN lease, the landlord may still be responsible for some items such as the roof or structure. In an absolute NNN lease, the tenant is responsible for essentially all costs, including major repairs and replacements.",
      },
      {
        q: "What is a cap rate on a net lease property?",
        a: "The capitalization rate is the property's annual net operating income divided by its purchase price. For net lease properties, cap rates generally reflect the tenant's credit, the remaining lease term, rent increases, lease type and location.",
      },
      {
        q: "What is a corporate guarantee versus a franchisee guarantee?",
        a: "A corporate guarantee means the parent company is responsible for the lease. A franchisee guarantee means an independent operator is responsible. Corporate guarantees from large, creditworthy companies are generally viewed as lower risk.",
      },
      {
        q: "What is a sale-leaseback?",
        a: "A transaction in which a business sells the real estate it occupies to an investor and leases it back long-term. The business frees up capital, and the investor gains a net lease property with an established tenant.",
      },
    ],
    propertyTypes: ["Single Tenant"],
    listingsHeading: "Available Single Tenant Net Lease Listings",
    emptyListings: "There are no single tenant net lease properties on the market right now.",
  },
];

export const findServicePage = (slug) => servicePages.find((p) => p.slug === slug);

// Splits "text with [a link](/path)" into parts for rendering.
export function parseLinks(text) {
  const parts = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1], href: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

export const plainText = (text) => parseLinks(text).map((p) => p.text).join("");

// Structured data (schema.org JSON-LD) for search engines.
export function serviceJsonLd(page) {
  const url = SITE_ORIGIN + servicePath(page.slug);
  const org = {
    "@type": "RealEstateAgent",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    telephone: "+1-949-221-1800",
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postal,
      addressCountry: ADDRESS.country,
    },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.seoTitle,
        description: page.metaDescription,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        name: page.title,
        serviceType: page.title,
        description: page.intro,
        areaServed: { "@type": "Country", name: "United States" },
        provider: org,
        url,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
          { "@type": "ListItem", position: 2, name: "Services", item: SITE_ORIGIN + "/expertise" },
          { "@type": "ListItem", position: 3, name: page.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
