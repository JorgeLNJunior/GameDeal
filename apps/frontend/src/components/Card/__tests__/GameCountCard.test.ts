import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import GameCountCard from "../GameCountCard.vue";

describe('GameCountCard', () => {
  it('should render the game count', async () => {
    const selector = '[data-testid=count]'
    const gameCount = 184
    const gamesSinceLastWeek = 19

    const wrapper = mount(GameCountCard, {
      props: { gameCount, gamesSinceLastWeek }
    })

    expect(wrapper.find(selector).text()).toBe(gameCount.toString())
  })

  it('should render news games since last week correctly', async () => {
    const selector = '[data-testid=sinceLastWeek]'
    const gameCount = 184
    const gamesSinceLastWeek = 19
    const result = `+${gamesSinceLastWeek} desde a última semana`

    const wrapper = mount(GameCountCard, {
      props: { gameCount, gamesSinceLastWeek }
    })

    expect(wrapper.find(selector).text()).toBe(result)
  })
})
