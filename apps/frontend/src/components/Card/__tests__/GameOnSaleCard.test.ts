import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import GamesOnSaleCard from "../GamesOnSaleCard.vue";

describe('GameOnSaleCard', () => {
  it('should render the game count', async () => {
    const selector = '[data-testid=count]'
    const salesCount = 20
    const salesSinceYesterday = 6

    const wrapper = mount(GamesOnSaleCard, {
      props: { salesCount, salesSinceYesterday }
    })

    expect(wrapper.find(selector).text()).toBe(salesCount.toString())
  })

  it('should render news games since last week correctly when the number is positive', async () => {
    const selector = '[data-testid=sinceYesterday]'
    const salesCount = 20
    const salesSinceYesterday = 6
    const result = `+${Math.abs(salesSinceYesterday)} desde ontem`

    const wrapper = mount(GamesOnSaleCard, {
      props: { salesCount, salesSinceYesterday }
    })

    expect(wrapper.find(selector).text()).toBe(result)
  })

  it('should render news games since last week correctly when the number is negative', async () => {
    const selector = '[data-testid=sinceYesterday]'
    const salesCount = 20
    const salesSinceYesterday = -6
    const result = `-${Math.abs(salesSinceYesterday)} desde ontem`

    const wrapper = mount(GamesOnSaleCard, {
      props: { salesCount, salesSinceYesterday }
    })

    expect(wrapper.find(selector).text()).toBe(result)
  })
})
